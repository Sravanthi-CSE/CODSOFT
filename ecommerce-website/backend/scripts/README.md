# Product Data Management Scripts

This directory contains scripts to backup, restore, and manage your product data safely.

## 📦 Available Scripts

### 1. `backupProducts.js`
Creates a complete backup of all products in JSON format.

**Usage:**
```bash
node scripts/backupProducts.js
```

**What it does:**
- Connects to MongoDB
- Exports all products with complete details (including images)
- Saves to `backups/products_backup_YYYY-MM-DD.json`
- Shows backup summary

### 2. `restoreProducts.js`
Restores products from a backup file.

**Usage:**
```bash
node scripts/restoreProducts.js path/to/backup/file.json
```

**What it does:**
- Clears existing products
- Imports products from backup file
- Validates data integrity

### 3. `listProducts.js`
Displays all products organized by category.

**Usage:**
```bash
node scripts/listProducts.js
```

**What it does:**
- Shows complete product inventory
- Organized by category
- Includes images, prices, stock levels
- Shows total inventory value

### 4. `seedProducts.js`
Adds sample products (admin only).

**Usage:**
```bash
node scripts/seedProducts.js
```

### 6. `addNewCategorySamples.js`
Adds sample products for newly added categories.

**Usage:**
```bash
node scripts/addNewCategorySamples.js
```

**What it does:**
- Adds sample products for Books and Toys & Games categories
- Demonstrates the new category functionality

## 🛡️ Data Safety Features

1. **Persistent Storage**: Products are stored in MongoDB with automatic timestamps
2. **Image Preservation**: Images are stored as URLs and preserved during edits
3. **Validation**: Server-side validation ensures data integrity
4. **Backup System**: Regular backups protect against data loss
5. **Admin Protection**: Only admins can modify products or use seed endpoint

## 📁 Backup Files Location

All backups are stored in: `backend/backups/`

## 🔒 Security

- Seed endpoint requires admin authentication
- Product creation/update includes validation
- Image URLs are validated for proper format

## 💡 Recommendations

1. **Regular Backups**: Run `backupProducts.js` regularly
2. **Before Major Changes**: Create backup before bulk operations
3. **Verify Data**: Use `listProducts.js` to verify data integrity
4. **Image URLs**: Use reliable image hosting services for product images