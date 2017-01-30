+# heavenJS Beta ( client side )
 +heavenJS is simple library to make view interface of web.
 +
 +Problem solving
 +- http request 
 +- looping number
 +- template
 +- form validation
 + 
 +### heavenJS innerHTML
 +    <div control="webApp">
 +        <div>
 +            <div>
 +              <select stage="carsList">
 +                <!--:
 +                forEach :: cars as list.
 +                  <option value="::list">::list</option>
 +                ::end.
 +                :-->
 +              </select>
 +            </div>
 +            <div stage="book">
 +                <!--:
 +                    return :: element.
 +                        <p>hallo,.. I am heavenJS,.. now I am read a ::book.name
 +                    ::end.
 +                 :-->
 +            </div>
 +        </div>
 +    </div>             
 +
 +### heavenJS call in JavaScript
 +
 +    var hv = new heavenJS({
 +        control : "webApp",
 +        data:{
 +          cars:["inova","Jazz"],
 +          book:{name:"management Book"}
 +        }
 +    });    
 +
 +doc see here https://github.com/rachmanzz/heavenjs/wiki
