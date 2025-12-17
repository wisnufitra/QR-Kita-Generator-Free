let currentMode = 'link';
const qrOutput = document.getElementById("qr-canvas");
const resultView = document.getElementById("result-view");
const placeholderView = document.getElementById("placeholder-view");

function setMode(mode) {
    currentMode = mode;
    
    // Reset Views
    document.querySelectorAll('.input-group').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tab-item').forEach(el => el.classList.remove('active'));
    
    // Activate View
    document.getElementById(`input-${mode}`).classList.remove('hidden');
    
    // Activate Tab Button (Logic mencari tombol yang diklik)
    const buttons = document.querySelectorAll('.tab-item');
    if(mode === 'link') buttons[0].classList.add('active');
    if(mode === 'wifi') buttons[1].classList.add('active');
    if(mode === 'wa') buttons[2].classList.add('active');
}

function generateQR() {
    let finalString = "";
    const fgColor = document.getElementById("color-fg").value;
    const bgColor = document.getElementById("color-bg").value;

    // LOGIKA 1: MODE LINK
    if (currentMode === 'link') {
        const url = document.getElementById("val-link").value;
        if (!url) return alert("Mohon masukkan link URL!");
        finalString = url;
    }

    // LOGIKA 2: MODE WIFI
    else if (currentMode === 'wifi') {
        const ssid = document.getElementById("val-wifi-ssid").value;
        const pass = document.getElementById("val-wifi-pass").value;
        if (!ssid) return alert("Nama WiFi wajib diisi!");
        // Format standar global QR WiFi
        finalString = `WIFI:T:WPA;S:${ssid};P:${pass};;`;
    }

    // LOGIKA 3: MODE WHATSAPP (Fitur Penting!)
    else if (currentMode === 'wa') {
        let phone = document.getElementById("val-wa-num").value;
        const msg = document.getElementById("val-wa-msg").value;
        
        if (!phone) return alert("Nomor WhatsApp wajib diisi!");
        
        // Membersihkan nomor (buang 0 di depan jika ada)
        if (phone.startsWith("0")) {
            phone = phone.substring(1);
        }
        
        // Encode pesan agar spasi & simbol terbaca browser
        const encodedMsg = encodeURIComponent(msg);
        finalString = `https://wa.me/62${phone}?text=${encodedMsg}`;
    }

    // RENDER QR CODE
    qrOutput.innerHTML = ""; // Bersihkan QR lama
    
    new QRCode(qrOutput, {
        text: finalString,
        width: 256, // Resolusi tinggi
        height: 256,
        colorDark : fgColor,
        colorLight : bgColor,
        correctLevel : QRCode.CorrectLevel.H // High Error Correction (Biar kalau lecek dikit masih kebaca)
    });

    // UX: Tampilkan hasil
    placeholderView.classList.add("hidden");
    resultView.classList.remove("hidden");
}

function downloadQR() {
    const img = qrOutput.querySelector("img");
    if(img) {
        const a = document.createElement("a");
        a.href = img.src;
        a.download = "QR-Code-Saya.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}