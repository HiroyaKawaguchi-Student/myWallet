//=>13章13ページを参照
const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/7a410f8a7c10474e93cc21add7053906"));


//sectionをゲット
let createAccount = document.getElementById('createAccount');
let KeystoreDownload = document.getElementById('KeystoreDownload');
let PrivateKeyCopy = document.getElementById('PrivateKeyCopy');
let ViewWalletInfo = document.getElementById('ViewWalletInfo');
let ImportAccount = document.getElementById('importAccount')
let viewWallet = document.getElementById('viewWallet');

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
})


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
  if (!privateKey.match(/^[0-9A-Fa-f]{64}$/)) {
  window.alert('Enter the private key.')
    } else {
      let account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
      importAccount(account);

      ImportAccount.style.display = 'none';
      viewWallet.style.display = 'block';

      document.getElementById('generateTransaction').addEventListener('click', async function(){
      /*   .//with onclick method i thought it would work, but did not.
        document.getElementById('unlockWithKey').onclick = function (){
          let account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
        };
        document.getElementById('unlockWithKeystore').onclick = function () {
          let password = document.getElementById('enterYourPassword').value;
          const account = web3.eth.accounts.decrypt(keyObj, password);
        };
      */
        let addressFrom = account.address;
        console.log(addressFrom);
        let addressTo = document.getElementById('toAddress').value;
        let gasPrice = document.getElementById('gasPrice').value;
        let gasLimit = document.getElementById('gasLimit').value;
        let value = document.getElementById('amountToSend').value;
        let privateKey = document.getElementById('inputKey').value;

        let nonce = await web3.eth.getTransactionCount(addressFrom);
        console.log(nonce);

        let rawTransaction = {
              nonce: web3.utils.toHex(nonce),
              gasPrice: web3.utils.toHex(gasPrice),
              gasLimit: web3.utils.toHex(gasLimit),
              to: addressTo,
              value: web3.utils.toHex(web3.utils.toWei(value, 'ether')),
              data: "0x"
            };

        let transaction = new ethereumjs.Tx(rawTransaction);
        console.log(transaction);  // NOT FUNCTIONING!!!
        privateKey = new ethereumjs.Buffer.Buffer(privateKey.substr(2), 'hex');
        console.log(privateKey);

        transaction.sign(privateKey);
        let serializeTx = transaction.serialize();

        let signedTransaction = '0x' + serializeTx.toString('hex');
        console.log(signedTransaction);



      })

    }
})

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
      const account = web3.eth.accounts.decrypt(keyObj, password);
      importAccount(account);

      ImportAccount.style.display = 'none';
      viewWallet.style.display = 'block';
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
})
//generateTransactionのeventclickerは let addressFromがうまく取れなかった関係で、unlockWithKeyのクリック関数の中へ写した。
