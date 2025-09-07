// localStorage Sync Utility
// Bu script'i browser console'da çalıştır

// Veriyi URL olarak paylaş
function shareData() {
  const data = {
    products: JSON.parse(localStorage.getItem('products') || '[]'),
    productionRecords: JSON.parse(localStorage.getItem('production-records') || '[]'),
    adminUsers: JSON.parse(localStorage.getItem('admin-users') || '[]')
  }
  
  const compressed = btoa(JSON.stringify(data))
  const url = `${window.location.origin}?data=${compressed}`
  
  navigator.clipboard.writeText(url).then(() => {
    alert('Sync URL kopyalandı! Diğer cihazda bu URL\'i aç')
    console.log('Sync URL:', url)
  })
}

// URL'den veriyi al
function loadDataFromURL() {
  const urlParams = new URLSearchParams(window.location.search)
  const data = urlParams.get('data')
  
  if (data) {
    try {
      const decoded = JSON.parse(atob(data))
      
      if (decoded.products) localStorage.setItem('products', JSON.stringify(decoded.products))
      if (decoded.productionRecords) localStorage.setItem('production-records', JSON.stringify(decoded.productionRecords))
      if (decoded.adminUsers) localStorage.setItem('admin-users', JSON.stringify(decoded.adminUsers))
      
      alert('Veriler başarıyla yüklendi! Sayfa yenileniyor...')
      window.location.href = window.location.origin + window.location.pathname
    } catch (error) {
      console.error('Veri yükleme hatası:', error)
    }
  }
}

// Otomatik çalıştır
loadDataFromURL()

console.log('🔄 LocalStorage Sync Ready!')
console.log('📤 Veri göndermek için: shareData()')
console.log('📥 Veri almak için: URL\'de ?data= parametresi olmalı')

// Global scope'a ekle
window.shareData = shareData
