# 🚢 Fluxmare AI - Tổng quan tính năng

## 📋 Mục lục
1. [Giới thiệu](#giới-thiệu)
2. [Tính năng cốt lõi](#tính-năng-cốt-lõi)
3. [Tính năng nâng cao](#tính-năng-nâng-cao)
4. [AI Models](#ai-models)
5. [Dashboard Analytics](#dashboard-analytics)
6. [User Guide](#user-guide)
7. [Lợi ích](#lợi-ích)

---

## 🎯 Giới thiệu

**Fluxmare** là hệ thống AI chatbot chuyên phân tích **Total.MomentaryFuel (kg/s)** - tiêu thụ nhiên liệu tức thời cho tàu thủy. Hệ thống sử dụng 7 features chuẩn FuelCast benchmark và nhiều AI models để dự đoán chính xác.

### Highlights
- 🤖 **5+ AI Models**: Random Forest, XGBoost, Neural Network, Gradient Boosting, SVR
- 📊 **7 Features Input**: Type, Datetime, Speed, Distance, Wind, Wave, Current
- 💬 **Dual Mode**: Form chuyên nghiệp + Chat text tự nhiên
- 📈 **Auto Dashboard**: Tự động hiển thị sau khi nhập đủ 7 features
- 🎨 **14 Themes**: Default + 13 presets + Custom RGB picker
- 📚 **History Tracking**: Sidebar với search, filter, export
- ⚡ **Real-time**: Dự đoán tức thời, không reload

---

## 🔥 Tính năng cốt lõi

### 1. 🤖 Hệ thống AI Models đa dạng

#### **Random Forest** 🌲
- **Mô tả**: Ensemble learning với nhiều decision trees
- **Ưu điểm**: 
  - Chống overfitting tốt
  - Xử lý missing data và outliers hiệu quả
  - Feature importance ranking tự động
- **Tốt nhất cho**: Dữ liệu đa dạng, nhiều biến
- **Performance**: MAE ~0.05, RMSE ~0.08, R² ~0.92

#### **XGBoost** 🚀
- **Mô tả**: Gradient boosting với regularization
- **Ưu điểm**:
  - Độ chính xác cao nhất trong các models
  - Regularization tránh overfitting
  - Parallel processing, training nhanh
- **Tốt nhất cho**: Khi cần accuracy tối đa
- **Performance**: MAE ~0.03, RMSE ~0.05, R² ~0.95

#### **Neural Network** 🧠
- **Mô tả**: Multi-layer perceptron (MLP) deep learning
- **Ưu điểm**:
  - Phát hiện non-linear patterns phức tạp
  - Adaptive learning rate
  - Scalable với data lớn
- **Tốt nhất cho**: Dữ liệu lớn, patterns phức tạp
- **Performance**: MAE ~0.04, RMSE ~0.06, R² ~0.93

#### **Gradient Boosting** 📈
- **Mô tả**: Sequential ensemble learning
- **Ưu điểm**:
  - Tối ưu từng bước, sequential optimization
  - Excellent cho time-series prediction
  - Hiệu quả với dữ liệu không cân bằng
- **Tốt nhất cho**: Time-series, sequential data
- **Performance**: MAE ~0.04, RMSE ~0.07, R² ~0.93

#### **Support Vector Regression (SVR)** 🎲
- **Mô tả**: Kernel-based regression với margin optimization
- **Ưu điểm**:
  - Kernel trick cho non-linear relationships
  - Robust với outliers
  - Margin-based optimization
- **Tốt nhất cho**: Dữ liệu phi tuyến, ít nhiễu
- **Performance**: MAE ~0.06, RMSE ~0.09, R² ~0.90

### 2. 💬 Dual Input Mode

#### **Form Input (7 Features)**
Nhập đầy đủ 7 features FuelCast benchmark:

1. **Type**: Loại tàu
   - `diverse`: Tàu dịch vụ, kéo, cá (0.05-0.2 kg/s)
   - `mpv`: Multi-purpose vessel (0.1-0.4 kg/s)
   - `tanker`: Tàu chở dầu, khí (0.3-0.8 kg/s)
   - `ropax`: Ferry chở khách + xe (0.2-0.5 kg/s)
   - `container`: Tốc độ cao 20-25 knots (0.3-0.7 kg/s)

2. **Datetime**: Thời gian phân tích (mỗi 15 phút)

3. **Speed_calc**: Tốc độ tàu (0-30 knots)
   - Ảnh hưởng theo công thức Speed^2.8
   - Giảm 2 knots → tiết kiệm ~15-20% fuel

4. **Distance**: Quãng đường di chuyển (nautical miles)

5. **Wind_speed**: Tốc độ gió (m/s)
   - Ảnh hưởng lớn đến tiêu thụ
   - Ngược chiều tăng 10-20% consumption

6. **Wave_height**: Độ cao sóng (m)
   - Sóng >2m tăng 10-15% tiêu thụ

7. **Current_speed**: Dòng hải lưu (m/s)
   - Thuận chiều giảm, ngược chiều tăng

#### **Chat Text Mode**
- Textarea riêng cho chat text tự nhiên
- Hỏi đáp tự do với AI, không cần form
- Toggle "Ẩn Form" để chuyển đổi dễ dàng

### 3. 📈 Auto Dashboard

Dashboard tự động hiển thị sau khi nhập đủ 7 features:

#### **Chỉ số chính**
- **Total Fuel Consumption**: kg và tons
- **Cost Estimation**: Tính theo $0.65/kg (customizable)
- **Average Rate**: kg/nautical mile
- **Efficiency Score**: 0-100% so với optimal
- **CO₂ Emissions**: Ước tính khí thải (tons)

#### **Biểu đồ**
- **Time Series**: Fuel theo thời gian (mỗi 15 phút)
- **Speed vs Consumption**: Quan hệ Speed^2.8
- **Weather Impact**: Wind, Wave, Current effects
- **Model Comparison**: So sánh predictions từ các AI
- **Current vs Optimal**: So với điều kiện tối ưu

#### **AI Recommendations**
- Tối ưu tốc độ: Giảm 10-20% → tiết kiệm 30-40%
- Route planning: Tránh sóng lớn, chọn tuyến ngắn
- Maintenance alerts: Phát hiện bất thường sớm
- Best practices: Dựa trên historical data

### 4. 📚 History & Tracking

#### **Sidebar lịch sử**
- 🔍 **Search**: Theo date, ship type, AI model
- ⭐ **Bookmark**: Đánh dấu predictions quan trọng
- 🗑️ **Manage**: Xóa, archive predictions cũ
- 📊 **Filter**: Lọc đa tiêu chí
- 📥 **Export**: CSV/JSON download
- 🔄 **Sync**: Cloud sync với Supabase (optional)

#### **Statistics Dashboard**
- Tổng số predictions
- AI model usage distribution
- Average fuel consumption theo ship type
- Cost savings từ optimizations
- Most active time periods

---

## 🚀 Tính năng nâng cao

### 1. 🗄️ Training Data Management

- **View datasets**: Xem training data với 7 features
- **Upload CSV/Excel**: Import data mới cho training
- **Data validation**: Auto-check quality, missing values
- **Data cleaning**: Remove outliers, normalize features
- **Feature engineering**: Tạo derived features tự động

### 2. 🎓 Model Training & Versioning

- **Retrain models**: Train lại với data mới
- **Version control**: Track versions (v1.0, v1.1...)
- **A/B testing**: So sánh versions trên validation set
- **Performance tracking**: MAE, RMSE, R² cho mỗi version
- **Rollback**: Quay về version cũ nếu cần

### 3. 🎨 Theme Customization

#### **Default Theme**
- Dark: `#2002a6` (deep blue)
- Light: `#e3d5f7` (light purple)

#### **14 Preset Themes**
- Pink, Blue, Purple, Ocean, Sunset
- Emerald, Rose, Indigo, Teal, Amber
- Lime, Fuchsia, Sky

#### **Custom RGB Picker**
- Tùy chỉnh màu chủ đạo hoàn toàn
- Dark/Light mode auto-adjust
- Glass effects SaaS style (Notion/Linear inspired)
- Logo brightness tự động điều chỉnh

### 4. ⚙️ Advanced Settings

- **Font size**: Small, Medium, Large
- **Language**: Vietnamese, English
- **Notifications**: Toast với swipe-to-dismiss
- **Auto-save**: Tự động lưu predictions
- **Default AI model**: Chọn model ưa thích
- **Theme preferences**: Save per user

### 5. 🔐 Admin & Security

#### **Admin Dashboard**
- User management
- System analytics
- Model performance monitoring
- Usage statistics

#### **Role-based Access**
- **Admin**: Full access, manage users
- **Analyst**: Advanced features, training data
- **User**: Basic features, predictions

#### **Security**
- Audit logs
- Activity tracking
- Session management
- Data encryption (với Supabase)

---

## 📊 Dashboard Analytics

### Metrics Explained

#### **Total Fuel Consumption**
```
Total = Σ(MomentaryFuel × Time_interval)
Time_interval = 15 minutes = 0.25 hours
```

#### **Efficiency Score**
```
Efficiency = (Optimal_Fuel / Actual_Fuel) × 100%
Optimal_Fuel = Based on ideal conditions (calm sea, optimal speed)
```

#### **Cost Estimation**
```
Cost = Total_Fuel_kg × Fuel_Price_per_kg
Default: $0.65/kg (marine diesel oil)
Customizable in settings
```

#### **CO₂ Emissions**
```
CO₂ = Total_Fuel_kg × Emission_Factor
Emission_Factor ≈ 3.17 kg CO₂/kg fuel
```

### Charts & Visualizations

#### **Time Series Chart**
- X-axis: Datetime (15-min intervals)
- Y-axis: Fuel consumption (kg/s)
- Line colors: Different AI model predictions
- Tooltips: Detailed metrics per point

#### **Speed vs Consumption**
- X-axis: Speed (knots)
- Y-axis: Fuel consumption (kg/s)
- Curve: Speed^2.8 relationship
- Optimal speed zone highlighted

#### **Weather Impact**
- Bar chart: Wind, Wave, Current contributions
- Stacked bars: Combined effects
- Baseline: Calm conditions

---

## 📖 User Guide

### Quick Start

1. **Đăng nhập/Đăng ký**
   - Email + Password
   - Continue with Google (OAuth)

2. **Chọn AI Model**
   - Dropdown menu: 5+ models
   - Hover để xem performance metrics

3. **Nhập dữ liệu**
   - **Option 1**: Form với 7 features
   - **Option 2**: Chat text tự nhiên

4. **Xem Dashboard**
   - Auto-hiển thị sau khi nhập đủ 7 features
   - Scroll để xem charts & metrics

5. **Lưu vào History**
   - Auto-save hoặc manual bookmark
   - Search & filter để tìm lại

### Tips & Best Practices

#### 🎯 **Tối ưu nhiên liệu**
- Giảm tốc độ 10-20% → tiết kiệm 30-40%
- Tránh sóng >2m
- Chọn thời điểm hải lưu thuận chiều
- Vệ sinh thân tàu 6 tháng/lần
- Theo dõi mỗi 15 phút

#### 🔍 **Sử dụng AI Models**
- **XGBoost**: Khi cần accuracy tối đa
- **Random Forest**: Dữ liệu đa dạng, nhiều outliers
- **Neural Network**: Patterns phức tạp, non-linear
- **Gradient Boosting**: Time-series prediction
- **SVR**: Dữ liệu phi tuyến, ít nhiễu

#### 📊 **Dashboard Analysis**
- So sánh Current vs Optimal để tìm gaps
- Track trends theo thời gian
- Identify anomalies sớm
- Export reports định kỳ

---

## 💰 Lợi ích

### Tiết kiệm chi phí
- ✅ Giảm fuel cost 30-40%
- ✅ Tăng operational efficiency 20-25%
- ✅ Giảm maintenance cost 10-15%
- ✅ ROI trong 3-6 tháng

### Môi trường
- ✅ Giảm CO₂ emissions lên đến 35%
- ✅ Compliance với IMO regulations
- ✅ Green shipping certification

### Vận hành
- ✅ Real-time monitoring mỗi 15 phút
- ✅ Phát hiện bất thường sớm 2-3 ngày
- ✅ Data-driven decisions với AI
- ✅ Automated reporting

### Cạnh tranh
- ✅ Competitive advantage với AI
- ✅ Modern fleet management
- ✅ Customer trust & transparency

---

## 🔗 Resources

- [Quick Start Guide](./QUICK_START.md)
- [API Documentation](./API_ENDPOINTS.md)
- [Backend Integration](./BACKEND_INTEGRATION.md)
- [Development Guide](./DEVELOPMENT.md)

---

## 📞 Support

- 💬 **Chat**: Sử dụng chat text trong app
- 📧 **Email**: fluxmare_admin@gmail.com
- 👨‍💼 **Admin**: Đăng nhập với admin account

---

**Fluxmare AI** - Intelligent Fuel Analytics for Maritime Industry 🚢
