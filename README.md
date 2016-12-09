# Chek last Realise

## Under Development

### heavenJS working style

    var hv = new heavenJS({
      control: "webApp",
      commandExclusive:true,
      modules :{
        // call module
      }
      });


on html

    <div control="webApp">
        <div>
            <div>
                <!--:
                    @a :: [GET] http://localhost/ajax.php
                    @b :: hello word
                 :-->
                <!--:
                    forEach :: a as b.
                        <div>::b</div>
                    ::end.
                 :-->
            </div>
        </div>
    </div>
