# heavenJS Beta
heavenJS in this version is different, with new code style, heavenJS not leaving a pattern again, because heavenJS stand on html comment,.
 
### heavenJS innerHTML
    <div control="webApp">
        <div>
            <div>
              <select stage="carsList">
                <!--:
                #newcars :: [GET] http://yoururl.com/other
                #mybook :: [GET] http://yoururl.com/book
                ~forEach :: cars as list.
                  <option value="::list">::list</option>
                ::end.
                :-->
              </select>
            </div>
            <div stage="book">
                <!--:
                    return :: element.
                        <p>hallo,.. I am heavenJS,.. now I am read a ::book.name
                    ::end.
                 :-->
            </div>
        </div>
    </div>
    
looping number on forEach
    
    ~forEach :: cars as list.
               ::loop{1} ::list
     ::end.
                    
using javascript expression

    ::js{web === true ? 1 : 0}
    ::js{web #not true ? "yes" : "not"}
    
note : #not as !== 

call javascript function

    ::js{myfuction(1000)};

### heavenJS call in JavaScript

    var hv = new heavenJS({
        control : "webApp",
        data:{
          cars:["inova","Jazz"],
          book:{name:"management Book"}
        }
    });
    
#### set new data
    
    hv.data('cars',["Honda Brio","Toyota Avanza"]); // set new data to cars
    hv.render('[stage="carsList"]'); // render heavenJS in carsList stage
    
    
### ajax request
heavenJS include simple ajax request

    hv.request('newcars applyTo cars','carsList');

get data from #newcars (see heavenJS innerHTML) then apply to cars

    hv.request('newcars applyTo cars',function(data,response){
        // response return object from ajax request
        data.nData(response); // nData is new Data
        data.eRender('carsList'); // render to stage of carsList
    });
    
get data from #mybook
    
    hv.request('mybook applyTo book',function(data,response){
            data.name = response.name; // this just work if data is object
            data.eRender('book'); // render to stage of book
        });
        
request ajax only without applying

    hv.request('mybook',function(response){
                
            });
                
#### form submit
form submit prototype not work with get method,..
to submit form, need h:submit attribut in form

##### example

    <div control="webApp">
        <form action="http://url" method="post" h:submit="login">
            <input type="text" name="username" placeholder="username">
            <input type="password" name="pass" placeholder="password">
            <button type="submit">Login</button>
        </form>
    </div>
    
javascript
    
    hv.form("login",
    {
    before:function(data){
        this.validation({
            username : "required|min:4",
            pass: "required|min:8|max:12"
        });
    },
    readyState : function(){
        this.onReceive = function(res,status){
        }
        if(this.notValid){ // if validation is error
           console.log(this.validateError);
        }
    }
    });
    
## Combine with laravel
####set up csrf-token. 

add meta tag in html like this

    <meta name="csrf-token" content="{!! csrf_token() !!}">
    
setup requestHeader
    
    var web = new heavenJS({
                control:"webApp",
                requestHeader:function (xhttp) {
                  xhttp.setRequestHeader("X-CSRF-TOKEN", document.querySelector('meta[name="csrf-token"]').getAttribute('content'));
                },
                data:{
                  
                }
              });
    

