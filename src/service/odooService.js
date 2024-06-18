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

  getEmployees: async (uid) => {
    try {
      const body = `<?xml version="1.0"?>
        <methodCall>
          <methodName>execute_kw</methodName>
          <params>
            <param><value><string>${db}</string></value></param>
            <param><value><int>${uid}</int></value></param>
            <param><value><string>${password}</string></value></param>
            <param><value><string>hr.employee</string></value></param>
            <param><value><string>search_read</string></value></param>
            <param><value><array><data><value><array><data></data></array></value></data></array></value></param>
            <param><value><struct><member><name>fields</name><value><array><data><value><string>name</string></value><value><string>work_email</string></value></data></array></value></member></struct></value></param>
          </params>
        </methodCall>`;

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

      const employees =
        result.methodResponse.params.param.value.array.data.value.map(
          (emp) => ({
            name: emp.struct.member.find((m) => m.name === "name").value.string,
            work_email: emp.struct.member.find((m) => m.name === "work_email")
              .value.string,
          })
        );

      return employees;
    } catch (error) {
      console.error("Error fetching employees from Odoo:", error);
      return [];
    }
  },
};

export default odooService;
