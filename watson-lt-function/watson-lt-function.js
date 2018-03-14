function process(request) {
    const base64Codec = require('codec/base64');
    const query = require('codec/query_string');
    const console = require('console');
    const xhr = require('xhr');
    const pubnub = require('pubnub');
    const auth = require('codec/auth');
    //console.log(request.message);


    if (request.message.data.type == 'REQUEST')
    {
        console.log ("Request to translate " + request.message.data.text + " from " + request.message.data.source_lang + " to " + request.message.data.target_lang);
      /*
        TODO: fill values
      */
        // Watson Language Translator Service credential - User name
      let ltUsername = 'YOUR_WATSON_LANG_TRANSLATOR_USERNAME';
      // Watson Language Translator Service credential -  Password
      let ltPassword = 'YOUR_WATSON_LANG_TRANSLATOR_PASSWORD';

      let ltUrl = 'https://gateway.watsonplatform.net/language-translator/api/v2/translate'
        /*
          TODO: end fill values
        */

        let base64Encoded = base64Codec.btoa(ltUsername + ':' + ltPassword);

        // bot auth
        var ltAuth = auth.basic(ltUsername,ltPassword);

        let payload = JSON.stringify({

                "source":request.message.data.source_lang,
                "target":request.message.data.target_lang,
                "text":request.message.data.source_text

        });


        let httpOptions = {
            "method": "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization":ltAuth
            },
            body: payload
        };

        //let url = ltUrl + '?' + query.stringify(queryParams);
        //console.log(url);
        //console.log(payload);


        return xhr.fetch(ltUrl, httpOptions)
            .then(response => {
                      //request.message.sender = senderName;

                          var parsedResponse = JSON.parse(response.body);
                          console.log("Translation sought:" + parsedResponse);
                          request.message.data.target_text = parsedResponse.translations[0].translation;
                          pubnub.publish
                          ({
                              channel: request.message.channel,
                              message: request.message
                              //message: parsedResponse.intents[0].intent + "  " + parsedResponse.entities[0].value
                          });

                          //request.message.data.text = "ERROR: Exceeded 32K message size Limitation";
                          //pubnub.publish({
                            //  channel: request.message.channel,
                            //  message: request.message
                          //});
                        console.log("Translation published");
                        return request.ok();
                  }, e => {
            console.log(e);
            return request.ok();
        })
        .catch((e) => {
            console.error(e);
            return request.ok();
        });

    }

    else

    {
       console.log("Not a request");
       return request.ok();

    }

    console.log("Returning");
    return request.ok();
}
