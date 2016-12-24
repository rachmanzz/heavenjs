# Chek last Realise

## Under Development

### heavenJS code style
heavenJS not using jQuery again. now heavenJS is standalone use ES5,.. heavenJS have new style code, that make page not leaving a pattern again.

### heavenJS innerHTML

    <div control="webApp">
        <div>
            <div>
              <select>
                <!--:
                forEach :: a as cars.
                  <option value="::cars">::cars</option>
                ::end.
                :-->
              </select>
              <div bind="data">
                <!--:
                  return :: element.
                   <p>inova is buying on ::buyOn</p>
                  ::end.
                :-->
              </div>
            </div>
        </div>
        <button onclick="clickMe()">click me</button>
    </div>

### heavenJS call in JavaScript

    var hv = new heavenJS({
        control : "webApp",
        data:{
          a:{
            value: ['daihatsu','inova','lamborgini']
          },
          buyOn:{
            value:"2011"
          }
        },
        commandExclusive:true
    });

    function clickMe(){
      // set new data
        hv.data('buyOn',{
          value:"2015"
          });
      hv.render('div[bind="data"]');
    }
