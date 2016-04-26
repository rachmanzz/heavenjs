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
    </div>
    
all of heavenJS function run inner control, that you must define control first
    
#### Looping Data
    heavenjs.foreach(jsonObject,'model'); // standard
        
        //html
        <ol model="model">
            <li>.....</li>
        </ol>
        
###### Pattern Keys

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
    
    heavenjs.foreach(jsonObject,'model as data'); // advanced method
        heavenjs.model(function(model){
            var data=model.data; // define your model
            
            /* your code here */
                 
                 ...........
        });
    
        heavenjs.foreach(jsonObject,'model as data').model(function(model){
                var m=model.data; // defined model
                m.data.keys =function(value){ // 
                
                            /* .. condition .. */
                            /* .. value is your jsonObject keys value .. */
                            
                            return value;
                        }
                /* diferent way */        
                m.pull=['id','price']; // pull id & price from your JSONObject
                m.get= function (x) { // get your id & price after pulled
                    
                    /* .. condition .. */
                    /* .. x is object value that has pulled .. */
                    /* .. try console.log(x) .. */
                    
                    m.put.key=x; // replace pattern key with x value  
                }
                            
                return m; // return your model
            });
            
            .pull='id'; // single value .get() function return string or int
            .pull='all'; // pull all of JSONObject Value, return array
            .pull=['id','price'] // pull some value of JSONObject, return array
            
[reference:pattern keys](https://github.com/rachmanzz/heavenjs#pattern-keys)            


#### Push
##### html
    <div push="x as item">
         ...........
    </div>
    
##### javascript
    heavenjs.push(function(x){
        x=x.item;
            ............
        return x;
    });
    
    .data // object, push data to html
    .put.key // string/number, push data to html  
    
diffrent way ( not recommended, whitespace is not allowed ) 

    <div push-data="x as myitem{'price':1230,'home:{'city':'jakarta'}'}">
        ([x:price]), test subObject ([x:home.city]) 
    </div>
    
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
            <tfoot push-data="x as item">
                <tr>
                    <td colspan="3">
                       Total
                    </td>
                    <td>
                        ([x:total])
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
    
######  - Javascript
    
    //json Object
    var myjson='[{"id":2,"name":"Asus phone","price":500,"date":"2016-04-21"},' +
                '{"id":3,"name":"Lenovo phone","price":210,"date":"2016-04-22"},' +
                '{"id":5,"name":"Alienware","price":61000,"date":"2016-04-22"}]';
    var total=0,heavenjs=new heavenJS({control:'myApp'});
    heavenjs.foreach($.parseJSON(myjson),'item as x').model(function(model){
                   var m=model.x;
                   m.pull='price';
                   m.get= function (x) {
                    total = total+x;
                    var myOpinion;
                      if(x <= 350){
                        myOpinion="Low Price";
                      }else if(x <= 800){
                        myOpinion="Normal Price";
                      }else{
                       myOpinion="expensive";
                      }
                       m.put.opinion=myOpinion; 
                   }        
                   return m;
               });
    heavenjs.push(function(x){
        x=x.item;
        x.put.total=total;
        return x;
    });
    
##### change symbol
    var heavenjs=new heavenJS(syBegin:"\\{\\{",syEnd:"\\}\\}");
        
    
[Demo](https://github.com/rachmanzz/heavenjs/tree/master/demo)    