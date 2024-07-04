import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { URL,DB_NAME,USERNAME_DB,PASSWORD } from '@env'


/* const url = `${URL}`;
const db = `${DB_NAME}`;
const username = `${USERNAME_DB}`;
const password = `${PASSWORD}`;
console.log(URL, DB_NAME, USERNAME_DB, PASSWORD); */

/*  const url = URL;      
const db = DB_NAME;    
const username = USERNAME_DB;  
const password = PASSWORD; 
 */
const parser = new XMLParser();

const odooService = {
 /* authenticate: async () => {
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
 */
  authenticate: async (url, dbName, username, password) => {
    try {
      // Construir el cuerpo XML para la autenticación
      const body = `<?xml version="1.0"?>
        <methodCall>
          <methodName>authenticate</methodName>
          <params>
            <param><value><string>${dbName}</string></value></param>
            <param><value><string>${username}</string></value></param>
            <param><value><string>${password}</string></value></param>
            <param><value><struct></struct></value></param>
          </params>
        </methodCall>`;

      // Realizar la solicitud POST a Odoo
      const response = await axios.post(`${url}/xmlrpc/2/common`, body, {
        headers: { "Content-Type": "text/xml" },
      });

      // Parsear la respuesta XML
      const parser = new XMLParser();
      const parsedResponse = parser.parse(response.data);
      console.log("Parsed response:", parsedResponse); // Debugging: imprime la respuesta para verificar su estructura

      // Verificar si hay un error de fault en la respuesta
      if (parsedResponse.methodResponse?.fault) {
        const faultValue = parsedResponse.methodResponse.fault.value;
        console.error("Fault response:", faultValue);
        throw new Error(`Error en la llamada XML-RPC: ${JSON.stringify(faultValue)}`);
      }

      // Obtener el UID de la respuesta
      const uid = parsedResponse.methodResponse?.params?.param?.value?.int;
      if (uid) {
        console.log("Authentication success. UID:", uid);
        return uid;
      } else {
        console.log("Authentication failed. No UID found in response.");
        return null;
      }
    } catch (error) {
      console.error("Error autenticando con Odoo:", error);
      return null;
    }
  },

  
  callOdoo: async (uid, model, method, fields, domain = []) => {
    const domainXml = `
      <value>
        <array>
          <data>
            ${domain.map(([field, operator, value]) => `
              <value>
                <array>
                  <data>
                    <value><string>${field}</string></value>
                    <value><string>${operator}</string></value>
                    <value>${typeof value === 'string' ? `<string>${value}</string>` : `<${typeof value}>${value}</${typeof value}>`}</value>
                  </data>
                </array>
              </value>
            `).join('')}
          </data>
        </array>
      </value>`;

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
          <param>
            <value>
              <struct>
                <member>
                  <name>fields</name>
                  <value>
                    <array>
                      <data>
                        ${fields.map((field) => `<value><string>${field}</string></value>`).join('')}
                      </data>
                    </array>
                  </value>
                </member>
              </struct>
            </value>
          </param>
        </params>
      </methodCall>`;

    console.log("Request body:", body);
    try {
      const response = await axios.post(`${url}/xmlrpc/2/object`, body, {
        headers: { "Content-Type": "text/xml" },
      });

      const result = parser.parse(response.data);
      console.log("Response result:", JSON.stringify(result, null, 2));

      if (result.methodResponse.fault) {
        const faultDetails = result.methodResponse.fault.value.struct.member.reduce(
          (acc, member) => {
            acc[member.name] = member.value.string || member.value.int;
            return acc;
          },
          {}
        );
        console.error("Fault response:", faultDetails);
        throw new Error(`Error in XML-RPC call: ${JSON.stringify(faultDetails)}`);
      }

      // Check and handle both single and multiple order responses
      const params = result.methodResponse.params.param.value;
      if (!params || !params.array || !params.array.data) {
        if(result.length=== 0){
        console.error("Empty Orders");

        }
        console.error("Unexpected response format:", JSON.stringify(result, null, 2));
        throw new Error("Expected an array of values in the response");
      }

      const valuesArray = Array.isArray(params.array.data.value)
        ? params.array.data.value
        : [params.array.data.value];  // Handle single value case

      const records = valuesArray.map((record) => {
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
      });

      return records;
    } catch (error) {
      console.error("Error fetching data from Odoo:", error);
      return [];
    }
  },

  getEmployees: async (uid) => {
    const fields = ["name", "work_email"];
    return await odooService.callOdoo(uid, "hr.employee", "search_read", fields);
  },

  getSaleOrdersSent: async (uid) => {
    const fields = ["partner_id", "create_date", "amount_total", "state"];
    const domain = [['state', '=', 'sent']];

    return await odooService.callOdoo(uid, "sale.order", "search_read", fields, domain);
  },

  confirmOrders: async (uid, orders) => {
    try {
      for (const order of orders) {
        const orderId = order.id;
        const method = "action_confirm";
        const body = `<?xml version="1.0"?>
          <methodCall>
            <methodName>execute_kw</methodName>
            <params>
              <param><value><string>${db}</string></value></param>
              <param><value><int>${uid}</int></value></param>
              <param><value><string>${password}</string></value></param>
              <param><value><string>sale.order</string></value></param>
              <param><value><string>${method}</string></value></param>
              <param><value><array><data><value><int>${orderId}</int></value></data></array></value></param>
            </params>
          </methodCall>`;

        const response = await axios.post(`${url}/xmlrpc/2/object`, body, {
          headers: { "Content-Type": "text/xml" },
        });

        const result = parser.parse(response.data);
        if (result.methodResponse.fault) {
          const faultDetails = result.methodResponse.fault.value.struct.member.reduce(
            (acc, member) => {
              acc[member.name] = member.value.string || member.value.int;
              return acc;
            },
            {}
          );
          console.error("Fault response:", faultDetails);
          throw new Error(`Error in XML-RPC call: ${JSON.stringify(faultDetails)}`);
        }
      }
      console.log("Confirm order success");
      return true;
    } catch (error) {
      console.log("Confirm order error", error);
      return false;
    }
  },
}

export default odooService;
