/**
 * 加密解密
 */

var App = App || {};

if(typeof(App) != "undefined") {
    App.Crypto = function () {
        //sjcl中默认cbc不启用，启用CBC
        (sjcl.beware && sjcl.beware["CBC mode is dangerous because it doesn't protect message integrity."])();
        //AES加密中CBC模式的初始向量值
        var AES_CBC_IV = "09be9361930af491075a69ccd83ed7a0";
        //密码hash运算时，默认迭代次数
        var HASH_PASSWORD_COUNT = 1000;
        //密码hash运算时，默认盐值
        var HASH_PASSWORD_SALT = "pn&nG_PE{k|Ot+~1j*pf4:?[k)]m0'IkOI@srOC=z}B&vSDu$!(l0b4s.q[dGR~s";
        //转换16进制字符串为ECC私钥
        var hex2eccPrivateKey = function(privateKey,eccKeyDef){
            eccKeyDef = eccKeyDef || sjcl.ecc.elGamal.secretKey;
            if((privateKey != null)&&(privateKey.length == 64)){
                return new eccKeyDef(sjcl.ecc.curves.k256,new sjcl.bn("0x" + privateKey));
            }
            return null;
        };
        //转换16进制字符串为ECC公钥
        var hex2eccPublicKey = function(publicKey,eccKeyDef){
            eccKeyDef = eccKeyDef || sjcl.ecc.elGamal.publicKey;
            if((publicKey != null)&&(publicKey.length == 128)){
                var x = publicKey.substr(0,64);
                var y = publicKey.substr(64);
                return new eccKeyDef(sjcl.ecc.curves.k256,
                    new sjcl.ecc.point(sjcl.ecc.curves.k256, new sjcl.bn.prime.p256k("0x" + x), new sjcl.bn.prime.p256k("0x" + y)));
            }
            return null;
        };
        return {
            /**
             * 生成采用secp256k1 椭球参数的256位ECC密钥对。
             */
            generateECCKey: function () {
                var keys = sjcl.ecc.elGamal.generateKeys(sjcl.ecc.curves.k256,0);
                return {
                    pubKey: sjcl.codec.hex.fromBits(keys.pub._point.x.toBits()) + sjcl.codec.hex.fromBits(keys.pub._point.y.toBits()),
                    privateKey:sjcl.codec.hex.fromBits(keys.sec._exponent.toBits())
                };
            },
            /** 使用自己的私钥及对方的公钥，利用ECDH算法计算共享密钥。ECDH共享公钥以16进制文本编码字符串返回。
             *
             * @param privateKey 自己的ECC私钥，16进制文本编码字符串。
             * @param publicKey 对方的ECC公钥，16进制文本编码字符串。
             */
            computeECDHShareKey: function(privateKey,publicKey){
                var privKey = hex2eccPrivateKey(privateKey);
                var serverPubKey = hex2eccPublicKey(publicKey);
                if((privKey != null)&&(serverPubKey != null)){
                    //sjcl库中原始的dh方法将计算出的点xy值进行了sha256，这样与其它库中算出来的不一致，此处采用下面方式计算。
                    var ecdh = serverPubKey._point.mult(privKey._exponent).x;
                    return sjcl.codec.hex.fromBits(ecdh.toBits());
                }
                return "";
            },
            /** 使用AES算法进行加密，加密密钥长度为128位，CBC工作模式，PKCS5Padding填充方式。加密后的密文采用Base64进行编码。
             *
             * @param aesKey AES密钥，16进制字符串，128位值(16进制字符串长度32)。
             * @param plainText 需要加密的明文。字符串使用utf-8编码。
             * @param iv 可选参数。CBC工作模式所需的初始化向量值，16进制字符串形式，128位值(16进制字符串长度32)。
             */
            aesEncrypt: function(aesKey,plainText,iv){
                if((aesKey != null) && aesKey.length >= 32 && (plainText != null) && (plainText.length > 0)){
                    if(aesKey.length > 32){
                        aesKey = aesKey.substr(0,32);
                    }
                    if ((iv == null) || iv.length() != 32){
                        iv = AES_CBC_IV;
                    }
                    var pt = sjcl.codec.utf8String.toBits(plainText);
                    var key = sjcl.codec.hex.toBits(aesKey);
                    var iv = sjcl.codec.hex.toBits(iv); //初始向量
                    var aes = new sjcl.cipher.aes(key);
                    var encCt = sjcl.mode.cbc.encrypt(aes, pt, iv);
                    return sjcl.codec.base64.fromBits(encCt);
                }
                return "";
            },
            /** 使用AES算法进行解密，加密密钥长度为128位，CBC工作模式，PKCS5Padding填充方式。
             *
             * @param aesKey AES密钥，16进制字符串。
             * @param cipherText 需要解密的密文，Base64编码的字符串。
             * @param iv 可选参数。CBC工作模式所需的初始化向量值，16进制字符串形式，128位值。
             */
            aesDecrypt: function(aesKey, cipherText,iv){
                if((aesKey != null) && aesKey.length >= 32 && (cipherText != null) && (cipherText.length > 0)){
                    if ((iv == null) || iv.length() != 32){
                        iv = AES_CBC_IV;
                    }
                    if(aesKey.length > 32){
                        aesKey = aesKey.substr(0,32);
                    }
                    var encCt = sjcl.codec.base64.toBits(cipherText);
                    var key = sjcl.codec.hex.toBits(aesKey);
                    var iv = sjcl.codec.hex.toBits(iv); //初始向量
                    var aes = new sjcl.cipher.aes(key);
                    var decPt = sjcl.mode.cbc.decrypt(aes, encCt, iv);
                    return sjcl.codec.utf8String.fromBits(decPt);
                }
                return "";
            },
            /** 使用ECDSA算法进行签名，其中用到的Hash算法为SHA256。签名后的值采用ASN.1 DER编码表示。
             *
             * @param privateKey ECDSA签名所用的ECC私钥。
             * @param plainText 需要签名的内容。字符串使用utf-8编码。
             */
            ecdsaSign: function(privateKey, plainText){
                var privKey = hex2eccPrivateKey(privateKey,sjcl.ecc.ecdsa.secretKey);
                if((privKey != null)&&(plainText != null) && (plainText.length > 0)){
                    var hash = sjcl.hash.sha256.hash(plainText);
                    var signature = privKey.sign(hash,0);
                    var sjclSign = sjcl.codec.hex.fromBits(signature);
                    //增加ASN.1 DER编码的头
                    var sign = "30440220" + sjclSign.substr(0,64) + "0220" + sjclSign.substr(64);
                    return sign;
                }
                return "";
            },
            /** 使用ECDSA算法进行签名验证，其中用到的Hash算法为SHA256。返回值为true表示验证通过。
             *
             * @param publicKey ECDSA签名验证所需的ECC公钥。
             * @param signature 原文文本的ECDSA签名值。
             * @param plainText 需要验证的原文内容。
             */
            ecdsaVerify: function(publicKey, signature, plainText){
                var pubKey = hex2eccPublicKey(publicKey,sjcl.ecc.ecdsa.publicKey);
                if((pubKey != null)&&(signature != null) && (signature.length > 0)&&(plainText != null) && (plainText.length > 0)){
                    //Java中的签名内容进行了ASN.1 DER编码，从ASN.1 DER 编码的签名值中提取数据
                    var asnString = signature;
                    var signatureHex = "";
                    asnString = asnString.substr(4);//去掉SEQUENCE头
                    var data_length = parseInt(asnString.substr(2,2),16);//获取r数据长度
                    signatureHex = asnString.substr(4 + (data_length - 32)*2,64); //获取r数据
                    asnString = asnString.substr(4 + data_length*2 ); //去掉r数据的头
                    data_length = parseInt(asnString.substr(2,2),16);//获取s数据长度
                    signatureHex += asnString.substr(4 + (data_length - 32)*2); //添加s数据

                    var hash = sjcl.hash.sha256.hash(plainText);
                    var sjclSignature = sjcl.codec.hex.toBits(signatureHex);
                    var result = false;
                    try{
                        result = pubKey.verify(hash, sjclSignature);//验证错误时，会抛异常
                    }catch(err){
                    }
                    return result;
                }
                return false;
            },
            /**
             * 对用户密码进行Hash运算，Hash算法采用为SHA256。返回16进制字符串。
             * @param password 需要进行hash的密码字符串。
             * @param salt 可选参数。进行hash运算的盐值。
             * @param count 可选参数。进行hash运算迭代次数。
             */
            hashPassword: function(password, salt, count){
                if((password != null)&&(password.length > 0)){
                    if ((salt == null) || salt.length < 32){
                        salt = HASH_PASSWORD_SALT;
                    }
                    if ((count == null) || count < 500){
                        count = HASH_PASSWORD_COUNT;
                    }
                    var P0 = '';
                    var P0Array = salt.split('');
                    for(var i = 0; i< password.length;i++){
                        if (P0Array.length > 3*i ) {
                            P0Array.splice(3*i,0,password.charAt(i));
                        }else {
                            P0Array.push(password.charAt(i));
                        }
                    }
                    P0 = P0Array.join('');
                    var P0 = sjcl.hash.sha256.hash(P0);
                    var bs = P0.length;

                    for(var i=1;i<count;i++){
                        var p = sjcl.hash.sha256.hash(P0);
                        for (var j=0; j<bs; j++) {
                            P0[j] = P0[j]^p[j];
                        }
                    }
                    return sjcl.codec.hex.fromBits(P0);
                }
                return "";
            }
        };
    }();
}
