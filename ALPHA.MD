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
    
## Controller
separate definitions "controller"
    web.control('webApp');
    
html atribut to define controller
    <div control="webApp">
    .......
    </div>
    
    
