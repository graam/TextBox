module.exports = {
    formatPhoneNumber : (s) => {
        var s2 = (""+s).replace(/\D/g, '');
        var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
        return (!m) ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];
    },
    formatDate : (s) => {
        var t = new Date();
        var ty = t.getFullYear();
        var tm = t.getMonth();
        var td = t.getDate();
        
        var d = new Date(s);
        var dy = d.getFullYear();
        var dm = d.getMonth();
        var dd = d.getDate();
        
        var dh = d.getHours();

        if(ty === dy && tm === dm && td === dd){
            if(dh > 12){
                dh -= 12;
                d.setHours(dh);
                return d.toLocaleTimeString('en-US') + " PM";
            }
            else return d.toLocaleTimeString('en-US') + " AM";
        }
        
        return d.toLocaleDateString('en-US');
    }
}

