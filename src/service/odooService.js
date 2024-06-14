import axios from 'axios';

const url = 'https://filling-room3.odoo.com';
const db = 'filling-room3';
const username = 'bqcount@gmail.com';
const password = '99091310514.JSE';

const odooService = {
  authenticate: async () => {
    try {
      const response = await axios.post(`${url}/xmlrpc/2/common`, {
        jsonrpc: "2.0",
        method: "call",
        params: {
          db: db,
          login: username,
          password: password
        }
      });

      const uid = response.data.result;
      if (uid) {
        console.log("Authentication success");
        return uid;
      } else {
        console.log("Authentication failed");
        return null;
      }
    } catch (error) {
      console.error('Error authenticating with Odoo:', error.response ? error.response.data : error.message);
      return null;
    }
  },

  getEmployees: async (uid) => {
    try {
      const response = await axios.post(`${url}/xmlrpc/2/object`, {
        jsonrpc: "2.0",
        method: "call",
        params: {
          model: 'hr.employee',
          method: 'search_read',
          args: [[], ['name', 'work_email']]
        }
      }, {
        auth: {
          username: uid,
          password: password
        }
      });

      return response.data.result;
    } catch (error) {
      console.error('Error fetching employees from Odoo:', error.response ? error.response.data : error.message);
      return [];
    }
  }
};

export default odooService;
