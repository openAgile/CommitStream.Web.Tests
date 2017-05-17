import test from 'ava';
import chai from 'chai';
import chaidiff from 'chai-diff';
import BaseAPI from '../dependencies/baseAPI';
let base = new BaseAPI();
chai.should();
chai.use(chaidiff);

// test.serial("Can I get an error for a non-existent instance?", t => {
//     const FAIL_COUNT = process.env.FAIL_COUNT || 1000;
//     for (let i = 0; i < FAIL_COUNT; i++) {
//         console.log("Running iteration #", i);
//         try {
//             base.getInstance({instanceId: "DoesNotExist", apiKey: "nothing-special-here"});
//         }
//         catch (error) {
//             t.is(error.response.status, 404, "Uh oh...");
//         }
//     }
// });

test.serial("Can I get an error for a non-existent instance?", async t => {
  const FAIL_COUNT = process.env.FAIL_COUNT || 1000;
  for (let i = 0; i < FAIL_COUNT; i++) {
    try {
    let response = await base.getInstance({instanceId: "DoesNotExist", apiKey: "nothing-special-here"});
    t.is(response.status, 404, "Uh oh..." + response.status);
    response.data.should.not.differentFrom(base.expectedInstanceResult(instance.instanceId, instance.apiKey));
    } catch (error) {
      console.log("Caught error: ", i + " -> " + error.response.statusText + " @ " + error.response.headers.date);
    }
  }
});
