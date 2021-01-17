//this index2.js is the exact same as the index.js except that 13章１２ページからの分のコードがdocument.getElementById('unlockWithKey')に入らず、一番下の１３の２の部分に入る。
//=>13章13ページを参照
const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/7a410f8a7c10474e93cc21add7053906"));
let erc20Contract = new web3.eth.Contract(ierc20Abi);
let erc721Contract = new web3.eth.Contract(ierc721Abi);

//sectionをゲット
let createAccount = document.getElementById('createAccount');
let KeystoreDownload = document.getElementById('KeystoreDownload');
let PrivateKeyCopy = document.getElementById('PrivateKeyCopy');
let ViewWalletInfo = document.getElementById('ViewWalletInfo');
let ImportAccount = document.getElementById('importAccount');
let viewWallet = document.getElementById('viewWallet');
let add721Token = document.getElementById('add721Token');
let add20Token = document.getElementById('add20Token');

//button要素をゲット
let continuee = document.getElementById('continue');    //continueにすると紫色の文字になったのでcontinueeにとりあえずした。
let saveYourAddress = document.getElementById('saveYourAddress');
let createNewAccount = document.getElementById('createNewAccount');

var download = document.getElementById('download');

//you can swtich tab with this click. jump to "view wallet info"
document.getElementById('navViewWalletInfo').addEventListener('click',function(){
  createAccount.style.display = 'none';
  KeystoreDownload.style.display ='none';
  PrivateKeyCopy.style.display = 'none';
  ViewWalletInfo.style.display = 'block';
  add721Token.style.display = 'none';
});

//p74 「最後に、余裕のある人は「Add ERC20 Token」と「Add ERC721 Token」のタブの切り替えを実装しましょう。以下のようになれば大丈夫です。」
document.getElementById('add20TokenBtn').addEventListener('click',function(){
  add20Token.style.display = 'block';
  add721Token.style.display = 'none';
});
document.getElementById('add721TokenBtn').addEventListener('click',function(){
  add20Token.style.display = 'none';
  add721Token.style.display = 'block';
});


createNewAccount.addEventListener('click', function() {
  let password = document.getElementById('enterPassword').value;
  if (password == "") {
    alert("Please Enter A Password");  //window.alertでもalertでも変わらない(?)。
  } else {
    let account = web3.eth.accounts.create();
    let keystore = web3.eth.accounts.encrypt(account.privateKey, password);
    let blob = new Blob([JSON.stringify(keystore)], {type:'application/json'});
    let url = URL.createObjectURL(blob);

    //var download = document.getElementById('download');　他のクリックイベントに使うので外に出した。
    download.href = url;

    var yourPrivateKey = document.getElementById('yourPrivateKey');
    yourPrivateKey.append(account.privateKey);  //appendChildでやろうとしてうまく行かなかったからappendにして、直接文字を入れた

    createAccount.style.display = 'none';
    KeystoreDownload.style.display = 'block';
  }
},false);


download.addEventListener('click', function() {
  continuee.disabled = false;
},false);

continuee.addEventListener('click', function() {
  KeystoreDownload.style.display = 'none';
  PrivateKeyCopy.style.display = 'block';
},false);

saveYourAddress.addEventListener('click', function() {
  let privateKey = document.getElementById('yourPrivateKey').value;
  let account = web3.eth.accounts.privateKeyToAccount(privateKey);
  importAccount(account);
  PrivateKeyCopy.style.display = 'none';
  ViewWalletInfo.style.display = 'block';
  ImportAccount.style.display= 'none';
  viewWallet.style.display='block';
},false);


//from here, the functions for "view wallet info"

//=>13章53ページを参照
let keyObj;

function importAccount(account){    //view wallet infoにアカウントの情報を表示するための関数
  let yourAddressTd = document.getElementById('yourAddressTd'); //表にアドレスを表示する際、appendchildでtdタグを追加しようとしたら、
  yourAddressTd.append(account.address);　　　　　　　　　　　　//元の表のスタイルが壊れた。appendの方が良いね。privatekeyの表示も同じく

  let yourPrivateKeyTd = document.getElementById('yourPrivateKeyTd');
  yourPrivateKeyTd.append(account.privateKey);

  web3.eth.getBalance(account.address).then((balance) => {
    document.querySelector('#yourBalance td').textContent = web3.utils.fromWei(balance, 'ether');

    let strong = document.createElement('strong');
    strong.textContent = "ETH";
    let yourBalanceTd = document.getElementById('yourBalanceTd');
    yourBalanceTd.append(strong);
    })
}

document.getElementById('unlockWithKey').addEventListener('click', function() {
  let privateKey = document.getElementById('inputKey').value;
  let privateKeyBuffer = ethereumjs.Util.toBuffer("0x" + privateKey);
  //if (!privateKey.match(/^[0-9A-Fa-f]{64}$/)) {
  if (!ethereumjs.Util.isValidPrivate(privateKeyBuffer)) {
  window.alert('Enter the private key.')
    } else {
      let account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
      importAccount(account);

      ImportAccount.style.display = 'none';
      viewWallet.style.display = 'block';
      document.getElementById('sendETH').style.display = 'block';
    }
});

document.getElementById('inputKeystore').addEventListener('change', function(e) {
  const file = e.target.files[0];
  e.target.nextElementSibling.textContent = file.name;

  var reader = new FileReader();
  reader.addEventListener('load', function(){

    try {
      keyObj = JSON.parse(reader.result);
    } catch (e) {
      alert("Please Select a Keystore.")
    }
  })
  reader.readAsText(file);

  document.getElementById('unlockWithKeystore').addEventListener('click', function() {
    let password = document.getElementById('enterYourPassword').value;
    if (password == "") {
      alert('Please Enter the Password.');
    } else {
      const account = web3.eth.accounts.decrypt(keyObj, password);   //why is it gotta be a const???
      importAccount(account);

      ImportAccount.style.display = 'none';
      viewWallet.style.display = 'block';
      document.getElementById('sendETH').style.display = 'block';
    }
  },false)

})

if (viewWallet.style.display == 'block') {
  document.getElementById('navViewWalletInfo').addEventListener('click',function(){
    ViewWalletInfo.style.display = 'block';
    viewWallet.style.display = 'none';
  },false)
}

//ここから１３の２になる

window.addEventListener('load', function(){
  web3.eth.getGasPrice().then((gasPrice) => {
    document.getElementById('gasPrice').value = gasPrice;
  })
  document.getElementById('gasLimit').value = "21000";
});

//ほんとはここにestimate gas の関数がなければいけない。１３章２のp１０に書いてあることをやる

document.getElementById('generateTransaction').addEventListener('click', async function(){
  //let privateKeyForGenerateTransaction = document.getElementById('inputKey').value;
  //let accountForGenerateTransaction = web3.eth.accounts.privateKeyToAccount('0x' + privateKeyForGenerateTransaction);
  //let privateKey = document.getElementById('inputKey').value;
  let privateKey = document.querySelector("#yourPrivateKey td").textContent;
  console.log(privateKey);
  /*let accountForGenerateTransaction = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
  let addressFrom = accountForGenerateTransaction.address; この２行を使ってaddressFrom をget しても動くが短い方が良い。*/
  //let addressFrom = document.getElementById('yourAddressTd').value; なぜかこの１行だけで済むと思ってやってみたらundefinedと表示されてしまった。privateKey=>account=> addressと手順を踏まないとできない。もっといい方法があるはずだが。
  let addressFrom = document.querySelector("#yourAddress td").textContent;
  console.log(addressFrom);
  let addressTo = document.getElementById('toAddress').value;
  let gasPrice = document.getElementById('gasPrice').value;
  let gasLimit = document.getElementById('gasLimit').value;
  let value = document.getElementById('amountToSend').value;
  //let privateKey = document.getElementById('inputKey').value;
  let unit = document.querySelector('.dropdown-toggle').textContent;

  //chapter13-8 p48に置いて、tranactionがrinkebye or BTの時と場合分けするためにifをつける
  if (unit === "Rinkeby ETH"){
    let nonce = await web3.eth.getTransactionCount(addressFrom); //await をなぜsync無しで使えるのか？

    let rawTransaction = {
          nonce: web3.utils.toHex(nonce),
          gasPrice: web3.utils.toHex(gasPrice),
          gasLimit: web3.utils.toHex(gasLimit),
          to: addressTo,
          value: web3.utils.toHex(web3.utils.toWei(value, 'ether')),
          data: "0x"
        };
    console.log(rawTransaction);
    let transaction = new ethereumjs.Tx(rawTransaction);
    console.log(transaction);　
    privateKey = new ethereumjs.Buffer.Buffer(privateKey.substr(2), 'hex'); //そもそもprivatekeyはlet privateKey = document.getElementById('inputKey').valueでゲットされていて、最初の二文字が省かれている。
    //privateKey = new ethereumjs.Buffer.Buffer(privateKey, 'hex');              =>それを元に戻したので１行前のものを使う
    console.log(privateKey);　

    transaction.sign(privateKey);
    let serializeTx = transaction.serialize();
    console.log(serializeTx);　

    let signedTransaction = '0x' + serializeTx.toString('hex');
    console.log(signedTransaction);　　　//comapred to google doc, i feel like what is shown on console is too long!!!

    var JsonRawTransaction = JSON.stringify(rawTransaction);
    document.getElementById('rawTransaction').append(JsonRawTransaction);
    document.getElementById('signedTransaction').append(signedTransaction); //13章２のP49にあるお手本とは見た目が違うが、if (unit === "Rinkeby ETH")の時は少なくともお金を送れたからおっけ。問題はこの下のelse以下のERC２０の時だ。
  } else {
    //ここから下がうまくいかない。console.log(estimateGas)で五桁の数字が出るはずがundefinedと出てしまう。
    //const contractAddress = document.getElementById('token20ContractAddress').value;
    const contractAddress = document.getElementById(unit).getAttribute('contractAddress');
    //const contractAddress = document.querySelectorAll('div[id=unit]')[0].getAttributeNode("src").value;
    //const contractAddress = document.getElementById(symbol).getAttribute('contractAddress');
    console.log(contractAddress);　　　　　　　　　　　　　　　　　　　　　　　　//テキストブック通りにやるならgetAttributeを使わなきゃいけない。
    erc20Contract.options.address = contractAddress;
    //const decimals = document.getElementById('decimals').value;
    const decimals = document.getElementById(unit). getAttribute('decimals');
    console.log(decimals);
    value = value * (10 ** decimals);  //why do i have to do this wheni t comes to ER20.
    console.log(value);

    const estimateGas = await erc20Contract.methods.transfer(addressTo, value.toString()).estimateGas({from: addressFrom})
    .then((gasAmount) => {  //what is the rule of function when i indent ?
       return gasAmount;
    })
    .catch(function(error){
       console.log(error);
    });
    console.log(estimateGas); //なぜこれがundefined と出てしまうのか？

     if (gasLimit < estimateGas) {
     alert(estimateGas + '以上にgasLimitを設定しましょう')
     return false;
    }
     let data = erc20Contract.methods.transfer(addressTo, value.toString()).encodeABI();
     console.log(data);

     let nonce = await web3.eth.getTransactionCount(addressFrom);
     let rawTransaction = {
            nonce: web3.utils.toHex(nonce),
            gasPrice: web3.utils.toHex(gasPrice),
            gasLimit: web3.utils.toHex(gasLimit),
            to: contractAddress,
            data: data
          };
     let transaction = new ethereumjs.Tx(rawTransaction);
     console.log(transaction);
     privateKey = new ethereumjs.Buffer.Buffer(privateKey.substr(2), 'hex');
     //privateKey = new ethereumjs.Buffer.Buffer(privateKey, 'hex');    //元々はprivatekeyの最初の二文字がすでに取れてる状態でgetしてたが、変えたので１つ上のものを使う。
     console.log(privateKey);

     transaction.sign(privateKey);
     let serializeTx = transaction.serialize();

     console.log(serializeTx);

     let signedTransaction = '0x' + serializeTx.toString('hex');
     console.log(signedTransaction);　　　//comapred to google doc, i feel like what is shown on console is too long!!!

     var JsonRawTransaction = JSON.stringify(rawTransaction);
     document.getElementById('rawTransaction').append(JsonRawTransaction);
     document.getElementById('signedTransaction').append(signedTransaction);
  }
});

document.getElementById('sendTransaction').addEventListener('click',function(){
   let signedTransaction = document.getElementById('signedTransaction').innerHTML;　//上のsignedTransaction持ってきても一緒じゃない？このぎょういらなくない？=>一緒でなく、テキストエリアの中身だけでなく、外枠までgetしてしまった。
   console.log(signedTransaction);
   web3.eth.sendSignedTransaction(signedTransaction)
    .on('transactionHash', function(hash){
      console.log(hash);
    })
    .on('receipt', function(receipt){
      console.log(receipt);

      document.getElementById('rawTransaction').value="";
      document.getElementById('signedTransaction').value="";

      let unit = document.querySelector('.dropdown-toggle').textContent;
      const symbol = document.getElementById('token20Symbol').value;
      const contractAddress = document.getElementById('token20ContractAddress').value;
      const decimals = document.getElementById('decimals').value;

      if (unit === symbol){
        const address = document.querySelector("#yourAddress td").textContent;
        erc20Contract.methods.balanceOf(address).call().then((value) => {
          console.log(value);

          //createTokenBalanceBody(symbol, contractAddress);
          //document.getElementById('tokenBalanceBody1').append(value/10**decimals);
          document.getElementById('tokenBalanceBody1').textContent = value/10**decimals;
          $('#sendTxModal').modal('hide');
        });
      } else {
      //let account = web3.eth.accounts.privateKeyToAccount('0x'+document.getElementById('inputKey').value);
      let account = web3.eth.accounts.privateKeyToAccount(document.querySelector("#yourPrivateKey td").textContent);
      console.log(account);
      importAccount(account);
       $('#sendTxModal').modal('hide');
       //document.getElementById('rawTransaction').value="";
       //document.getElementById('signedTransaction').value="";
       }
    })
    .on('error', function(error){
      alert(error)
    });     //ここでガスが入っているアカウントじゃないと動かない

//P56の「送信後、トークン数は更新されないので、以下のように自動的に更新されるように実装してみてください。」をここのif以下でやろうとしている。うまく行くのか？
    //let unit = document.querySelector('.dropdown-toggle').textContent;
    //const symbol = document.getElementById('token20Symbol').value;

    /*if (unit === symbol){
      //erc20Contract.options.address = contractAddress;
      const address = document.querySelector("#yourAddress td").textContent;
      erc20Contract.methods.balanceOf(address).call().then((value) => {
        console.log(value);
        document.getElementById('tokenBalanceBody1').append(value/10**decimals);
        document.getElementById('tokenBalanceBody2').append(symbol);
        document.getElementById('tokenBalanceBody3').append('ERC20');
      });
    }*/
});

function createTokenBalanceBody(symbol, contractAddress){
  var tokenBalanceBody = document.getElementById('tokenBalanceBody');
  var tablerow = document.createElement("TR");
  var tokenBalanceBody1 = document.createElement("TD");
  tokenBalanceBody1.setAttribute("id", "tokenBalanceBody1");
  var tokenBalanceBody2 = document.createElement("TD");
  var tokenBalanceBody3 = document.createElement("TD");
  tokenBalanceBody3.setAttribute("id", "tokenBalanceBody3");
  tokenBalanceBody.appendChild(tablerow);
  tablerow.appendChild(tokenBalanceBody1);
  tablerow.appendChild(tokenBalanceBody2);
  tablerow.appendChild(tokenBalanceBody3);
  tokenBalanceBody2.append(symbol);
  tablerow.setAttribute("contractAddress", contractAddress);
  tablerow.setAttribute("id", symbol);
}

//13-8-3 Custom tokenのjavascript

document.getElementById('saveToken20').addEventListener('click', function(){
  const contractAddress = document.getElementById('token20ContractAddress').value;
  const symbol = document.getElementById('token20Symbol').value;
  const decimals = document.getElementById('decimals').value;

  //let privateKey = document.getElementById('inputKey').value;
  //let accountForSaveToken20 = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
  //const address = accountForSaveToken20.address;
  //console.log(address);
  //const address = "0xdE9F470fD859728f114bb0C84f2e0E1454b783Cc"; //ここでいうaddressとはmyWallet上の人間がもつアカウントではなく、デプロイしたERC20トークンをもつアカウント、つまりメタマスクのアカウントのことをさす(?)。
  const address = document.querySelector("#yourAddress td").textContent;
  console.log(address);

  erc20Contract.options.address = contractAddress;
  erc20Contract.methods.balanceOf(address).call().then((value) => {
    console.log(value);   // why do i execute balanceOf(address)? this console.log(value) returns the balance of my account, not the contract address balance.... why not balanceOf(contractAddress)??

    createTokenBalanceBody(symbol, contractAddress);
    var tokenBalanceBody1 = document.getElementById('tokenBalanceBody1');
    tokenBalanceBody1.append(value/10**decimals);
    var tokenBalanceBody3 = document.getElementById('tokenBalanceBody3');
    tokenBalanceBody3.append('ERC20');
    var tablerow = document.getElementById(symbol);
    tablerow.setAttribute("decimals", decimals);


    /*document.getElementById('tokenBalanceBody1').append(value/10**decimals);    //with those 3 lines, value, symbol , ERC20 are added to the table.
    document.getElementById('tokenBalanceBody2').append(symbol);                  //i used to add only the values to the table. but i now build from the framework of the table with the codes above.
    document.getElementById('tokenBalanceBody3').append('ERC20');*/

    //document.getElementById('BT').id = document.getElementById('tokenBalanceBody2').append(symbol); //with the clcik of save button, the id, contractaddress, decimals are added to tr id='BT'
    //document.getElementById('BT').contractAddress = contractAddress;                                 //けどconsoleで見ようとしたら失敗したから、
    //document.getElementById('BT').decimals = decimals;

    var node = document.createElement("A"); //here this A means html a tag
    //var textnode = document.createTextNode("BT");
    var textnode = document.createTextNode(symbol);
    node.appendChild(textnode);
    document.getElementById("RinkebyETH_BT").appendChild(node);
    node.classList.add("dropdown-item");

    document.getElementById("RinkebyETH_ToBT").addEventListener('click', function(){
      document.getElementById("RinkebyETH").addEventListener('click', function(){
        document.getElementById("RinkebyETH_ToBT").innerHTML = "Rinkeby ETH";
      });
      node.addEventListener('click', function(){
        //document.getElementById("RinkebyETH_ToBT").innerHTML = "BT";
        document.getElementById("RinkebyETH_ToBT").innerHTML = symbol;
      });
    });
  });
});

document.getElementById('saveToken721').addEventListener('click', function(){
  document.getElementById('dogphoto').style.display = 'block';
  const contractAddress = document.getElementById('token721ContractAddress').value;
  const symbol = document.getElementById('token721Symbol').value;

  //let privateKey = document.getElementById('inputKey').value;
  //let accountForSaveToken721 = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
  //const accountAddress = accountForSaveToken721.address;
  //const accountAddress = "0xdE9F470fD859728f114bb0C84f2e0E1454b783Cc"; //このディプロイされたコントラクトトークンのアカウントアドレスをゲットする方法がわからない。web３でできるのか？
  const accountAddress = document.querySelector("#yourAddress td").textContent;
  erc721Contract.options.address = contractAddress;
  erc721Contract.methods.balanceOf(accountAddress).call().then((value) => { //ここのaddressはおそらくerc721Contract.options.address のアドレス、つまりcontractAddressをさす。
    console.log(value);

    createTokenBalanceBody(symbol, contractAddress);
    var tokenBalanceBody1 = document.getElementById('tokenBalanceBody1');
    tokenBalanceBody1.append(value);
    var tokenBalanceBody3 = document.getElementById('tokenBalanceBody3');
    tokenBalanceBody3.append('ERC721');

    /*document.getElementById('tokenBalanceBody1').append(value);
    document.getElementById('tokenBalanceBody2').append(symbol);
    document.getElementById('tokenBalanceBody3').append('ERC721');
    var ERC721TokenBalanceBody = document.getElementById('BT');
    ERC721TokenBalanceBody.id = "DOG";
    ERC721TokenBalanceBody.contractAddress = contractAddress;
    console.log(contractAddress);*/

    for (let i = 0; i < value; i++) {
        erc721Contract.methods.tokenOfOwnerByIndex(accountAddress, i).call().then((tokenId) => {
           console.log(tokenId); //on textbook it shuold be 0 but i got 1. why??

           erc721Contract.methods.tokenURI(tokenId).call().then((uri) => {
             console.log(uri);
              var request = new XMLHttpRequest();
              request.open('GET', uri);
              request.responseType = 'json';
              request.send();
              request.onload = function() {
                console.log(request.response);
              }
           });
           //p70の「DOM操作の際、以下のようにcol-sm-4クラスのついたdivタグに「contractAddress」と「tokenId」属性を勝手に作って、値を取得できるようにしておく」を以下でやろうとしている。
           var dogcard = document.getElementById('dogcard');
           dogcard.setAttribute("contractAddress", contractAddress);
           dogcard.setAttribute("tokenId", tokenId);
         });
      }
    });
});

async function transferERC721(button) {
  const contractAddress = button.parentNode.parentNode.parentNode.getAttribute('contractAddress');
  const tokenId = button.parentNode.parentNode.parentNode.getAttribute('tokenId');
  const accountAddress = document.querySelector('#yourAddress td').textContent;
  //const toAddress = button.previousSibling.firstChild.value;
  const toAddress = document.getElementById('dogaddress').value;

  erc721Contract.options.address = contractAddress;
  //const value = "0";
  const nonce = await web3.eth.getTransactionCount(accountAddress);
  const gasPrice = await web3.eth.getGasPrice();
  const gasLimit = await erc721Contract.methods.transferFrom(accountAddress, toAddress, tokenId).estimateGas({from: accountAddress})
    .then((gasAmount) => {
      return gasAmount + 1000;
    });
  const data = erc721Contract.methods.transferFrom(accountAddress, toAddress, tokenId).encodeABI();

  let rawTransaction = {
        nonce: web3.utils.toHex(nonce),
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(gasLimit),
        to: contractAddress,
        //value: web3.utils.toHex(web3.utils.toWei(value, 'ether')),
        data: data
      };

  console.log(rawTransaction);

  let transaction = new ethereumjs.Tx(rawTransaction);
  console.log(transaction);　

  let privateKey = document.getElementById('inputKey').value;
  //privateKey = new ethereumjs.Buffer.Buffer(privateKey.substr(2), 'hex');そもそもprivatekeyはlet privateKey = document.getElementById('inputKey').valueでゲットされていて、最初の二文字が省かれている。
  privateKey = new ethereumjs.Buffer.Buffer(privateKey, 'hex');
  console.log(privateKey);　

  transaction.sign(privateKey);
  let serializeTx = transaction.serialize();
  console.log(serializeTx);　

  let signedTransaction = '0x' + serializeTx.toString('hex');
  console.log(signedTransaction);　　　

  web3.eth.sendSignedTransaction(signedTransaction)
   .on('transactionHash', function(hash){
     console.log(hash);
   })
   .on('receipt', function(receipt){
     console.log(receipt);

     //let unit = document.querySelector('.dropdown-toggle').textContent;
     //const symbol = document.getElementById('token721Symbol').value;
     console.log(accountAddress);

     erc721Contract.methods.balanceOf(accountAddress).call().then((value) => {
       console.log(value);
       document.getElementById('tokenBalanceBody1').textContent = value;
       document.getElementById('dogphoto').style.display = 'none';
      $('#sendTxModal').modal('hide');
      //document.getElementById('rawTransaction').value="";
      //document.getElementById('signedTransaction').value="";　これらの代わりにtokenBalanceおよびトークンカードの値と表示を変更しましょう。
    });
   })
   .on('error', function(error){
     alert(error)
   });
};
