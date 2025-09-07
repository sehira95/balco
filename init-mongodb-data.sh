#!/bin/bash

# MongoDB'ye bağlan ve başlangıç verilerini ekle

mongosh <<EOF
use balco

// Ürün türlerini ekle
db.producttypes.deleteMany({})
db.producttypes.insertMany([
  {
    name: "Plastik Kutu",
    description: "Çeşitli boyutlarda plastik kutular",
    category: "Ambalaj",
    createdAt: new Date()
  },
  {
    name: "Kapak",
    description: "Plastik kutu kapakları",
    category: "Aksesuar",
    createdAt: new Date()
  },
  {
    name: "Conta",
    description: "Su geçirmez conta",
    category: "Sızdırmazlık",
    createdAt: new Date()
  },
  {
    name: "Bağlantı Parçası",
    description: "Birleştirme elemanları",
    category: "Montaj",
    createdAt: new Date()
  },
  {
    name: "Dekoratif Panel",
    description: "Estetik panel çözümleri",
    category: "Dekorasyon",
    createdAt: new Date()
  }
])

// Renkleri ekle
db.colors.deleteMany({})
db.colors.insertMany([
  {
    name: "Mavi",
    hexCode: "#3B82F6",
    category: "Ana Renkler",
    createdAt: new Date()
  },
  {
    name: "Kırmızı",
    hexCode: "#EF4444",
    category: "Ana Renkler",
    createdAt: new Date()
  },
  {
    name: "Siyah",
    hexCode: "#1F2937",
    category: "Ana Renkler",
    createdAt: new Date()
  },
  {
    name: "Beyaz",
    hexCode: "#F9FAFB",
    category: "Ana Renkler",
    createdAt: new Date()
  },
  {
    name: "Yeşil",
    hexCode: "#10B981",
    category: "Ana Renkler",
    createdAt: new Date()
  },
  {
    name: "Turuncu",
    hexCode: "#F59E0B",
    category: "Ana Renkler",
    createdAt: new Date()
  },
  {
    name: "Mor",
    hexCode: "#8B5CF6",
    category: "Ana Renkler",
    createdAt: new Date()
  },
  {
    name: "Gri",
    hexCode: "#6B7280",
    category: "Nötr Renkler",
    createdAt: new Date()
  }
])

// Koleksiyonları listele
print("=== Ürün Türleri ===")
db.producttypes.find().pretty()

print("=== Renkler ===")
db.colors.find().pretty()

print("=== Kullanıcılar ===")
db.users.find().pretty()

print("Başlangıç verileri başarıyla eklendi!")
EOF
