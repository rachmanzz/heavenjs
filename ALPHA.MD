# heavenJS ( Alpha )

## Initialize the plugin
    <script src="//code.jquery.com/jquery-1.12.0.min.js"></script>
    <script src="../dist/heavenjs-alpha.js"></script>
    

## What's new ?
 - removed model attribut, change with forEach
 - ajax request with easy setup
 - event handler
 
## Documentation
To start writing heavenJS script, need to define new heavenJS construct

        var web=new heavenJS();
        // with controller
        var web=new heavenJS({control:'webApp'});
    
### Controller
separate definitions "controller"

        web.control('webApp');
    
html atribut to define controller

        <div control="webApp">
        .......
        </div>
        
### Modules
Define a modules, to automatically  render a module.

        web.modules(['event','forEach']); // define only module that you need
        web.modules(['forEach'],{except : ['forEach.model']}); // skip model to render
        web.modules(['forEach'],{only : ['forEach.model','forEach.item']}); 


#### forEach
forEach ( looping data )

        <table>
            <thead>
                <tr>
                    <th>#</th><th>name</th><th>price</th>
                </tr>
            <thead>
            <tbody forEach="item.url:get['http://yoururl/myjson.php']">
                <tr>
                    <td>([ num++ ])</td><td>([ name ])</td><td>([ price ])</td>
                </tr>
            </tbody>
        </table>
        
        

        

    
    
