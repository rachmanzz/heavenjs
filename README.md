# Chek last Realise

## Under Development

### heavenJS code style
heavenJS not using jQuery again. now heavenJS is standalone use ES5,.. heavenJS have new style code, that make page not leaving a pattern again.

### heavenJS innerHTML

    <div control="webApp">
        <div>
            <div>
              <select stage="cars">
                <!--:
                @newcars :: [GET] http://url.com/
                ~forEach :: a as cars.
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
          a:["inova","Jazz"],
          buyOn:"1991"
        },
        commandExclusive:true
    });
    // data now not storing in object again..

    function clickMe(){
      // set new data
        hv.data('buyOn',"2005");
      hv.render('div[bind="data"]');
    }

### ajax request
heavenJS include simple ajax request

    hv.request('newcars applyTo a','cars');
