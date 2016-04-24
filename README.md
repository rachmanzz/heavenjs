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
    
all of heavenJS function run inner control, that you have defined control first
    
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
    ([replace[key](replace)]) //delete replace in value
    ([replace[key](data:newvalue)]) // replace data to newvalue
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
            
    
##### change symbol
    var heavenjs=new heavenJS(syBegin:"\\{\\{",syEnd:"\\}\\}");
    
    pattern keys
    {{keys}}