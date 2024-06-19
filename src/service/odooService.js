import axios from "axios";
import { XMLParser } from "fast-xml-parser";

const url = "https://filling-room3.odoo.com";
const db = "filling-room3";
const username = "bqcount@gmail.com";
const password = "99091310514.JSE";

const parser = new XMLParser();

const odooService = {
  authenticate: async () => {
    try {
      const body = `<?xml version="1.0"?>
        <methodCall>
          <methodName>authenticate</methodName>
          <params>
            <param><value><string>${db}</string></value></param>
            <param><value><string>${username}</string></value></param>
            <param><value><string>${password}</string></value></param>
            <param><value><struct></struct></value></param>
          </params>
        </methodCall>`;

      const response = await axios.post(`${url}/xmlrpc/2/common`, body, {
        headers: { "Content-Type": "text/xml" },
      });

      const result = parser.parse(response.data);
      const uid = result.methodResponse.params.param.value.int;
      if (uid) {
        console.log("Authentication success:", uid);
        return uid;
      } else {
        console.log("Authentication failed");
        return null;
      }
    } catch (error) {
      console.error("Error authenticating with Odoo:", error);
      return null;
    }
  },

  callOdoo: async (uid, model, method, fields, domain = []) => {
    const domainXml = domain
      .map((d) => {
        const [field, operator, value] = d;
        let valueXml;
        if (Array.isArray(value)) {
          valueXml = `<array><data>${value
            .map((v) => `<value><string>${v}</string></value>`)
            .join("")}</data></array>`;
        } else if (typeof value === "string") {
          valueXml = `<string>${value}</string>`;
        } else if (typeof value === "number") {
          valueXml = `<double>${value}</double>`;
        } else if (typeof value === "boolean") {
          valueXml = `<boolean>${value ? 1 : 0}</boolean>`;
        } else {
          valueXml = `<string>${value}</string>`;
        }
        return `
        <value><array><data>
          <value><string>${field}</string></value>
          <value><string>${operator}</string></value>
          <value>${valueXml}</value>
        </data></array></value>`;
      })
      .join("");

    const body = `<?xml version="1.0"?>
      <methodCall>
        <methodName>execute_kw</methodName>
        <params>
          <param><value><string>${db}</string></value></param>
          <param><value><int>${uid}</int></value></param>
          <param><value><string>${password}</string></value></param>
          <param><value><string>${model}</string></value></param>
          <param><value><string>${method}</string></value></param>
          <param><value><array><data>${domainXml}</data></array></value></param>
          <param><value><struct><member><name>fields</name><value><array><data>${fields
            .map((field) => `<value><string>${field}</string></value>`)
            .join("")}</data></array></value></member></struct></value></param>
        </params>
      </methodCall>`;

    try {
      const response = await axios.post(`${url}/xmlrpc/2/object`, body, {
        headers: { "Content-Type": "text/xml" },
      });

      const result = parser.parse(response.data);

      if (result.methodResponse.fault) {
        const faultDetails =
          result.methodResponse.fault.value.struct.member.reduce(
            (acc, member) => {
              acc[member.name] = member.value.string || member.value.int;
              return acc;
            },
            {}
          );
        console.error("Fault response:", faultDetails);
        throw new Error(
          `Error in XML-RPC call: ${JSON.stringify(faultDetails)}`
        );
      }

      const records =
        result.methodResponse.params.param.value.array.data.value.map(
          (record) => {
            const recordObj = {};
            record.struct.member.forEach((m) => {
              if (m.name === "partner_id") {
                recordObj[m.name] = m.value.array.data.value.map(
                  (nestedValue) => nestedValue.string || nestedValue.int || null
                );
              } else if (m.name === "amount_total") {
                recordObj[m.name] = m.value.double || m.value.string;
              } else {
                recordObj[m.name] = m.value.string || m.value.int || null;
              }
            });
            return recordObj;
          }
        );

      return records;
    } catch (error) {
      console.error("Error fetching data from Odoo:", error);
      return [];
    }
  },

  getEmployees: async (uid) => {
    const fields = ["name", "work_email"];
    return await odooService.callOdoo(
      uid,
      "hr.employee",
      "search_read",
      fields
    );
  },
  getPrueba: async (uid) => {
    // Luego, hacer la llamada a execute_kw
    return await axios.post(`${url}/xmlrpc/2/common`, {
      jsonrpc: "2.0",
      method: "execute_kw",
      params: {
        model: "sale.order",
        args: ["partner_id", "create_date", "amount_total", "state"],
        /* kwargs: {
          //domain: [["state", "=", "sent"]] // Filtro añadido
        }, */
      },
      id: uid,
    });
  },

  getSaleOrdersSent: async (uid) => {
    const fields = ["partner_id", "create_date", "amount_total", "state"];
    /*  const domain = [['state', 'in', ['sent']]];  */
    return await odooService.callOdoo(
      uid,
      "sale.order",
      "search_read",
      fields /* , domain */
    );
  },
};

export default odooService;
