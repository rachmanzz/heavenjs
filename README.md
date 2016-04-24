# heavenjs

## Documentation
#### Construct
    var heavenjs=new heavenJS();
    var heavenjs=new heavenJS({control:'webApp'}); // with controller
    
#### Controller
    //javascript
    heavenjs.control('webApp');
    
    //html
    <div control="webApp">
        .......
    </html>
    
all of heavenJS function run inner control, that you must define control first
    
#### Looping Data
    heavenjs.foreach(jsonObject,'model'); // standard
        
        //html
        <ol model="model">
            <li>.....</li>
        </ol>
        
Pattern Key

    ([key]) // default pattern
    ([num++]) // looping number
    ([num[3]+]) // looping number from 3
    ([replace[key](str)]) //delete str in value
    ([replace[key](str:string)]) // replace str to string
    ([numberFormat[key]]) // number format default
    ([numberFormat[key](ar-EG)]) // Arabic, en-US , ja-JP, ar-SA, hi-IN, de-DE, zh-Hans-CN-u-nu-hanidec | array is not working 
    ([math[key*key]]) // math
    ([math[total*price+3(4-2)]]) // math
     ([math[total*price+3(4-2)](default)]) // math with number format ; en-US , ja-JP, ar-SA, hi-IN, de-DE, zh-Hans-CN-u-nu-hanidec | array is not working
    ([limitText[key](12)]) // limit text
    ([limitText[key](8:20)]) // limit text

or
    
    heavenjs.foreach(jsonObject,'model as data'); // advance
        heavenjs.model(function(model){
            var data=model.data;
            // your code here
        });
    
        heavenjs.foreach(jsonObject,'model as data').model(function(model){
                var m=model.data;
                m.data.keys =function(value){
                            return value //keys value, here you can make condition
                        }
                m.pull=['id','price']; // get id and price value
                m.get= function (x) { // you need pull value before run .get() function
                    // x is object that you have pull
                    // then you can make condition here
                    m.put.keypattern=x; // replace pattern key with x value
                }
                            
                return m;
            });
            
            .pull='id'; // single value .get() function return string
            .pull='all'; // return all json value .get() function return array
            
#### Example
######  - HTML

    <div control="myApp">
        <table>
            <thead>
                <tr>
                    <td>#</td>
                    <td>name</td>
                    <td>price</td>
                    <td>opinion</td>
                </tr>    
            </thead>
            <tbody model="item">
                <tr>
                    <td>([num++])</td>
                    <td>([name])</td>
                    <td>$([numberFormat[price]])</td>
                    <td>([opinion])</td>
                </tr>
            </tbody>
        </table>
    </div>
    
######  - Javascript
    
    //json Object
    var myjson='[{"id":2,"name":"Asus phone","price":500,"date":"2016-04-21"},' +
                '{"id":3,"name":"Lenovo phone","price":210,"date":"2016-04-22"},' +
                '{"id":5,"name":"Alienware","price":61000,"date":"2016-04-22"}]';

   
   heavenjs.foreach(myjson,'item as x').model(function(model){
                   var m=model.x;
                   m.pull='price';
                   m.get= function (x) {
                    var myOpinion;
                      if(x <= 350){
                        myOpinion="Low Price";
                      }else if(x <= 800){
                        myOpinion="Normal Price";
                      }else{
                       myOpinion="expensive";
                      }
                       m.put.opinion=myOpinion; // replace pattern key with x value
                   }        
                   return m;
               });
    
##### change symbol
    var heavenjs=new heavenJS(syBegin:"\\{\\{",syEnd:"\\}\\}");