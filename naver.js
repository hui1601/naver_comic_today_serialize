importClass(javax.crypto.Mac);
importClass(javax.crypto.spec.SecretKeySpec);
importClass(java.lang.StringBuilder);
importClass(java.lang.StringBuffer);
importClass(java.util.Base64);
importClass(org.jsoup.Jsoup);
const _String = java.lang.String;


function toBase64(buffer) {
    return Base64.getEncoder().encodeToString(buffer);
}

function getInstance(str) {
    let secretKeySpec = new SecretKeySpec(new _String(str).getBytes(), "HmacSHA1");
    let instance = Mac.getInstance("HmacSHA1");
    instance.init(secretKeySpec);
    return instance;
}

function getUrl(mac, url, timestamp) {
    let substring = url.substring(0, Math.min(255, url.length));
    let sb = new StringBuilder();
    sb.setLength(0);
    sb.append(substring);
    sb.append(timestamp);
    let encode = encodeURIComponent(toBase64(mac.doFinal(new _String(sb.toString()).getBytes())));
    sb = new StringBuilder();
    sb.setLength(0);
    sb.append(url);
    if (url.includes("?")) {
        sb.append("&");
    } else {
        sb.append("?");
    }
    sb.append("msgpad=");
    sb.append(timestamp);
    sb.append("&md=");
    sb.append(encode);
    return sb.toString();
}
let day = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
let key = "39X8qcx6nZnK7nGWZu9Ts5APx5nHvOr54gjIWPnqqaBOy2VtUE9g0iEM6r6TWUnq";
let url = "https://apis.naver.com/mobiletoon/comic/getMainTitleList.json?order=VIEWCOUNT&cate=WEEK&deviceCode=MOBILE_APP_ANDROID";

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    if (msg == "/네웹") {
        let time = new Date().getTime() + "";
        let today = day[new Date().getDay()];
        let APIurl = getUrl(getInstance(key), url, time);
        let json = JSON.parse(Jsoup.connect(APIurl).ignoreContentType(true).get().text());
        let a = '결과' + '\u200b'.repeat(500) + '\n';
        json.message.result.webtoonTitleList.forEach(function(obj) {
            if (!obj.weekDayList.includes(today)) return;
            a = a + '\n\n' + obj.titleName + '\n작화: ' + obj.author.painter + '\n작가: ' + obj.author.writer;
        });
        replier.reply(a);
    }
}
