import http from 'k6/http';
import { check } from 'k6';

export let options = {
    scenarios: {
      testScript: {
        executor: 'per-vu-iterations',
        vus: 1,
        iterations: 1,
        maxDuration: '120s',
        exec: 'restApi'  
      },  
    },
  }


export function restApi() {
  console.log("Test started")
  let result = http.get(`https://reqres.in/api/users?page=2`);
  check(result, {
    'Get response is ok': (r) => r.status === 200,
    'Total key exists within json': (r) => JSON.parse(r.body)['total'] != undefined,
    'Last name exists for the first entry': (r) => JSON.parse(r.body)['data'][0]['last_name'] != undefined,
    'Last name exists for the second entry': (r) => JSON.parse(r.body)['data'][1]['last_name'] != undefined,
    //'Length value is correct': (r) => (JSON.parse(r.body)['data']).length == JSON.parse(r.body)['total']
  })

  let externalData = __ENV.TEST_USER == undefined ? "morpheus" : __ENV.TEST_USER
  let body = {"name": externalData ,"job":"leader"}
  let result_2 = http.post(`https://reqres.in/api/users`, body);
  check(result_2,{
    'Response code for create is 201': (r) => r.status === 201,
    'Response contains is': (r) => JSON.parse(r.body)['id'] != undefined,
    'Response date contains correct year': (r) => (JSON.parse(r.body)['createdAt']).includes(new Date().getFullYear()),
  })

}