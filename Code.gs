// Code.gs - File utama untuk Apps Script

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Aplikasi CBT Online')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// Memastikan semua sheet yang diperlukan tersedia
function initSpreadsheet() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Pastikan sheet Soal ada
    let soalSheet = ss.getSheetByName("Soal");
    if (!soalSheet) {
      throw new Error("Sheet 'Soal' tidak ditemukan. Pastikan ada sheet dengan nama 'Soal'.");
    }
    
    // Pastikan sheet Data Peserta ada
    let pesertaSheet = ss.getSheetByName("Data Peserta");
    if (!pesertaSheet) {
      pesertaSheet = ss.insertSheet("Data Peserta");
      pesertaSheet.appendRow([
        "Timestamp", "Nama Lengkap", "Asal Sekolah", "Nomor HP"
      ]);
      pesertaSheet.getRange(1, 1, 1, 4).setFontWeight("bold");
    }
    
    // Pastikan sheet Hasil Ujian ada
    let hasilSheet = ss.getSheetByName("Hasil Ujian");
    if (!hasilSheet) {
      hasilSheet = ss.insertSheet("Hasil Ujian");
      hasilSheet.appendRow([
        "Timestamp", "Nama Lengkap", "Asal Sekolah", "Nomor HP", "Skor", "Benar", "Total Soal", "Detail Jawaban"
      ]);
      hasilSheet.getRange(1, 1, 1, 8).setFontWeight("bold");
    }
    
    return {
      success: true,
      message: "Inisialisasi spreadsheet berhasil"
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

// Mengakses data soal dari Google Sheet
function getSoalData() {
  try {
    // Inisialisasi spreadsheet terlebih dahulu
    const initResult = initSpreadsheet();
    if (!initResult.success) {
      throw new Error(initResult.message);
    }
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const soalSheet = ss.getSheetByName("Soal");
    
    const data = soalSheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      throw new Error("Sheet 'Soal' kosong atau hanya berisi header.");
    }
    
    const headers = data[0];
    const soalList = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Periksa apakah baris memiliki pertanyaan
      if (!row[0] || row[0].toString().trim() === "") {
        continue;
      }
      
      const soal = {
        nomor: i,
        pertanyaan: row[0] || "",
        gambar: row[1] || "",
        tabel: row[2] || "",
        paragraf: row[3] || "",
        pilihanA: row[4] || "",
        pilihanB: row[5] || "",
        pilihanC: row[6] || "",
        pilihanD: row[7] || "",
        pilihanE: row[8] || "",
        jawabanBenar: row[9] || ""
      };
      
      soalList.push(soal);
    }
    
    return {
      success: true,
      data: soalList
    };
    
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

// Fungsi untuk kapitalisasi teks
function kapitalisasi(text) {
  if (!text) return "";
  return text.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Simpan biodata peserta ke sheet Data Peserta
function simpanBiodata(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const pesertaSheet = ss.getSheetByName("Data Peserta");
    
    // Kapitalisasi nama dan sekolah
    const namaKapital = kapitalisasi(data.nama);
    const sekolahKapital = kapitalisasi(data.sekolah);
    
    // Tambahkan data peserta ke sheet
    pesertaSheet.appendRow([
      new Date(), namaKapital, sekolahKapital, data.nomorHP
    ]);
    
    return {
      success: true,
      data: {
        nama: namaKapital,
        sekolah: sekolahKapital,
        nomorHP: data.nomorHP
      }
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

// Simpan hasil ujian ke sheet Hasil Ujian
function simpanHasil(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const hasilSheet = ss.getSheetByName("Hasil Ujian");
    
    // Hitung skor
    const hasil = hitungSkor(data.jawaban, data.soalList);
    
    // Tambahkan data hasil ke sheet
    hasilSheet.appendRow([
      new Date(),
      data.biodata.nama,
      data.biodata.sekolah,
      data.biodata.nomorHP,
      hasil.skor,
      hasil.benar,
      hasil.total,
      JSON.stringify(data.jawaban)
    ]);
    
    return {
      success: true,
      data: {
        biodata: data.biodata,
        hasil: hasil
      }
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

// Menghitung skor
function hitungSkor(jawabanSiswa, soalList) {
  let benar = 0;
  const hasilDetail = [];
  
  for (let i = 0; i < soalList.length; i++) {
    const soal = soalList[i];
    const jawabanBenar = soal.jawabanBenar.toString().trim();
    const jawaban = jawabanSiswa[i] ? jawabanSiswa[i].toString().trim() : "";
    
    // Cek kecocokan jawaban (lebih fleksibel)
    const isBenar = jawaban === jawabanBenar;
    
    // Debug log untuk melihat perbandingan jawaban
    Logger.log("Soal " + (i+1) + ": Jawaban siswa='" + jawaban + "', Jawaban benar='" + jawabanBenar + "', isBenar=" + isBenar);
    
    if (isBenar) benar++;
    
    hasilDetail.push({
      nomor: soal.nomor,
      pertanyaan: soal.pertanyaan,
      gambar: soal.gambar,
      tabel: soal.tabel,
      paragraf: soal.paragraf,
      jawabanSiswa: jawaban,
      jawabanBenar: jawabanBenar,
      isBenar: isBenar,
      pilihanA: soal.pilihanA,
      pilihanB: soal.pilihanB,
      pilihanC: soal.pilihanC,
      pilihanD: soal.pilihanD,
      pilihanE: soal.pilihanE
    });
  }
  
  // Hitung skor dengan formula (benar*100)/total
  const skor = soalList.length > 0 ? Math.round((benar * 100) / soalList.length) : 0;
  
  return {
    benar: benar,
    total: soalList.length,
    skor: skor,
    hasilDetail: hasilDetail
  };
}
