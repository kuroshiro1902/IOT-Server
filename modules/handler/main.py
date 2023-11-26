import sys
import json
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error

def analyze(data):

  # Đọc dữ liệu từ file CSV
  # df = pd.read_csv('temperature.csv')

  # Chuyển đổi dữ liệu thành DataFrame pandas
  df = pd.DataFrame(data)

  # Chuyển đổi cột 'time' thành giây
  df['time'] = df['time'] / 1000

  # Sau đó chuyển đổi thành datetime
  df['time'] = pd.to_datetime(df['time'], unit='s')

  # Kiểm tra dữ liệu thiếu
  # print(df.isnull().sum())

  # Chia dữ liệu thành tập huấn luyện và tập kiểm tra
  X_train, X_test, y_train, y_test = train_test_split(df[['time']], df['value'], test_size=0.2, random_state=42)

  # Xây dựng mô hình Random Forest
  model = RandomForestRegressor()
  model.fit(X_train, y_train)

  # Dự đoán trên tập kiểm tra
  # y_pred = model.predict(X_test)

  # Đánh giá mô hình
  # mse = mean_squared_error(y_test, y_pred)
  # print(f'Mean Squared Error: {mse}')

  # Lấy thời điểm cuối cùng trong dữ liệu
  last_timestamp = df['time'].max().timestamp()

  # Tạo 10 thời điểm tiếp theo, mỗi thời điểm cách nhau 60 giây
  future_timestamps = np.arange(last_timestamp + 60, last_timestamp + 600, 60)

  # Chuyển đổi thành DataFrame để sử dụng cho dự đoán
  future_df = pd.DataFrame(future_timestamps, columns=['time'])

  # Dự đoán nhiệt độ cho các thời điểm tương lai
  future_temperatures = model.predict(future_df)

  # Thêm dự đoán vào DataFrame
  future_df['value'] = future_temperatures

  # Chuyển đổi cột 'time' trở lại thành datetime
  # future_df['time'] = pd.to_datetime(future_df['time'], unit='s')

  return future_df.to_json(orient='records', date_format='iso')


if __name__ == "__main__":
    data_str = sys.argv[1]
    data = json.loads(data_str)
    print(analyze(data))