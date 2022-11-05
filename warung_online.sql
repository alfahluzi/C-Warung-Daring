-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.24-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.0.0.6468
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for warung_online
CREATE DATABASE IF NOT EXISTS `warung_online` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `warung_online`;

-- Dumping structure for table warung_online.akun
CREATE TABLE IF NOT EXISTS `akun` (
  `Akun_id` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(50) NOT NULL,
  `nomor_hp` varchar(50) NOT NULL DEFAULT '',
  `password` varchar(512) NOT NULL,
  `role` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Akun_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table warung_online.akun: ~5 rows (approximately)
INSERT INTO `akun` (`Akun_id`, `nama`, `nomor_hp`, `password`, `role`) VALUES
	(1, 'Aldi', '081293528500', '', 1),
	(2, 'al', '081293528500', '$2b$04$Y7vDgXb7mK013GQbXKyYLODZE5d87d8569rLTc0ykb3gDuTtC0D4m', 0),
	(3, 'admin', '123', '$2b$04$PrLyKItlfrtM8/.334E5aOWPveCZhKY5Hrm/nMo5/MOkp3.0/Anbq', 1),
	(4, 'costumer', '1234', '$2b$04$qR50PHVx/9uGh/lWlgF63.2acp3dpsWxQEonT6iB77TI1CvfqMwcC', 0),
	(5, 'cc', '90', '$2b$04$YCaLnzhQCpQ9qV.8UFzRHuyaCvcace3dD/zXK8ZlDAE3SS2IFltvm', 0);

-- Dumping structure for table warung_online.barang
CREATE TABLE IF NOT EXISTS `barang` (
  `Barang_id` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(50) NOT NULL,
  `detail` varchar(50) NOT NULL DEFAULT '',
  `kuantitas` int(11) NOT NULL DEFAULT 1,
  `foto` varchar(50) NOT NULL DEFAULT '',
  `jenis` int(11) NOT NULL,
  `harga` int(11) NOT NULL,
  `rating` int(11) NOT NULL DEFAULT 0,
  `jumlah_terjual` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`Barang_id`),
  KEY `jenis_pada_barang` (`jenis`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table warung_online.barang: ~4 rows (approximately)
INSERT INTO `barang` (`Barang_id`, `nama`, `detail`, `kuantitas`, `foto`, `jenis`, `harga`, `rating`, `jumlah_terjual`) VALUES
	(9, 'Beras', 'beras 1 kilo ', 20, '1667321179687.png', 13, 120000, 0, 0),
	(10, 'Daging Sapi', 'daging sapi lokal 100 gram', 100, '1667321252601.png', 14, 12000, 0, 0),
	(11, 'Susu Sapi', 'Susu Sapi Murni 100 ml', 100, '1667321357928.jpg', 2, 8000, 0, 0),
	(12, 'Gandum', 'Gandum siap pakai 1 kilo', 10, '1667321419604.png', 13, 65000, 0, 0);

-- Dumping structure for table warung_online.jenis_barang
CREATE TABLE IF NOT EXISTS `jenis_barang` (
  `Jenis_barang_id` int(11) NOT NULL AUTO_INCREMENT,
  `jenis` varchar(50) NOT NULL,
  `kategori_id` int(11) NOT NULL,
  PRIMARY KEY (`Jenis_barang_id`),
  KEY `FK_jenis_barang_kategori_barang` (`kategori_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table warung_online.jenis_barang: ~7 rows (approximately)
INSERT INTO `jenis_barang` (`Jenis_barang_id`, `jenis`, `kategori_id`) VALUES
	(1, 'Kopi', 2),
	(2, 'Dairy', 2),
	(6, 'Roti', 1),
	(12, 'Mie', 1),
	(13, 'Karbohidrat', 4),
	(14, 'Protein', 4),
	(15, 'Sumber Serat', 4);

-- Dumping structure for table warung_online.kategori_barang
CREATE TABLE IF NOT EXISTS `kategori_barang` (
  `Kategori_barang_id` int(11) NOT NULL AUTO_INCREMENT,
  `kategori` varchar(50) NOT NULL,
  PRIMARY KEY (`Kategori_barang_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table warung_online.kategori_barang: ~3 rows (approximately)
INSERT INTO `kategori_barang` (`Kategori_barang_id`, `kategori`) VALUES
	(1, 'Makanan'),
	(2, 'Minuman'),
	(4, 'Makanan Mentah');

-- Dumping structure for table warung_online.keranjang
CREATE TABLE IF NOT EXISTS `keranjang` (
  `Keranjang_id` int(11) NOT NULL AUTO_INCREMENT,
  `akun_id` int(11) NOT NULL,
  `barang_id` int(11) NOT NULL,
  `kuantitas` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`Keranjang_id`),
  KEY `barang_id` (`barang_id`),
  KEY `akun_id` (`akun_id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table warung_online.keranjang: ~0 rows (approximately)

-- Dumping structure for table warung_online.penjualan
CREATE TABLE IF NOT EXISTS `penjualan` (
  `Penjualan_id` int(11) NOT NULL AUTO_INCREMENT,
  `kode_resi` varchar(50) DEFAULT NULL,
  `id_barang` int(11) DEFAULT NULL,
  `nama_barang` varchar(50) DEFAULT NULL,
  `detail_barang` varchar(50) DEFAULT NULL,
  `kuantitas` int(11) DEFAULT NULL,
  `harga_jual` int(11) DEFAULT NULL,
  `harga_total` int(11) DEFAULT NULL,
  PRIMARY KEY (`Penjualan_id`),
  KEY `transaksi_pada_penjualan` (`kode_resi`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table warung_online.penjualan: ~3 rows (approximately)
INSERT INTO `penjualan` (`Penjualan_id`, `kode_resi`, `id_barang`, `nama_barang`, `detail_barang`, `kuantitas`, `harga_jual`, `harga_total`) VALUES
	(9, '1667532963852', 9, 'Beras', 'beras 1 kilo ', 3, 120000, 360000),
	(10, '1667534370714', 9, 'Beras', 'beras 1 kilo ', 2, 120000, 240000),
	(11, '1667541172799', 9, 'Beras', 'beras 1 kilo ', 1, 120000, 120000);

-- Dumping structure for table warung_online.transaksi
CREATE TABLE IF NOT EXISTS `transaksi` (
  `Transaksi_id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `waktu` varchar(50) NOT NULL DEFAULT '',
  `tanggal` varchar(50) NOT NULL DEFAULT '',
  `total_harga_transaksi` int(11) NOT NULL,
  `status_pembayaran` char(5) NOT NULL DEFAULT 'n',
  `status_pengambilan` char(5) NOT NULL DEFAULT 'n',
  `foto_pembayaran` varchar(50) DEFAULT NULL,
  `kode_resi` varchar(50) NOT NULL,
  PRIMARY KEY (`Transaksi_id`),
  KEY `transaksi_pada_akun` (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4;

-- Dumping data for table warung_online.transaksi: ~3 rows (approximately)
INSERT INTO `transaksi` (`Transaksi_id`, `customer_id`, `waktu`, `tanggal`, `total_harga_transaksi`, `status_pembayaran`, `status_pengambilan`, `foto_pembayaran`, `kode_resi`) VALUES
	(12, 3, '10.32.56', '4/11/2022', 360000, 'c', 'n', 'undefined', '1667532963852'),
	(13, 3, '10.57.30', '4/11/2022', 240000, 'c', 'n', 'undefined', '1667534370714'),
	(14, 3, '12.50.37', '4/11/2022', 120000, 'c', 'y', '1667541037356.jpg', '1667541172799');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
