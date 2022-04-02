# Q/A

## 1. Nếu mà triển khai phân tán. Khi có một giao dịch thì làm sao biết được node nào vừa thực hiện ?
* Hiện tại theo mô hình của hyperledger các giao dịch sinh ra thì sẽ được gửi đến tất cả các peer để chứng thức và sau đó sẽ gửi đến order service để cập nhật vào ledger
* Nếu khi mình triển khai phân tán hay trên một node thì các peer ở các node khác nhau cũng cần xác thức thực các giao dịch đó, sau đó gửi đến order service để cập nhật vào ledger. Trên mỗi peer đều có lưu trữ một bản sao của ledger
* Refs:
  * https://arunrajeevan.medium.com/transaction-flow-in-hyperledger-b7f9ee43ad60



## 2. Làm sao show được lịch sử cập nhật dữ liệu nếu mà bị trùng key ?
* Hyperledger có hỗ trợ **API GetHistoryForKey** để lấy về lịch sử cập nhật của một block. Hàm này sẽ được call trong smart contract và trả về lịch sử cập nhật một block
* Refs:
  * https://stackoverflow.com/questions/45570517/how-to-fetch-asset-modification-history-in-hyperledger-fabric




## 3. Kích thước lưu trữ dữ liệu tối đa của một block là bao nhiêu ?
* Mình có thể cấu hình được kích thước tối đa của một block thông qua **BatchTimeout** và **BatchSize**
trong file **configtx.yaml**
```
################################################################################
#
#   SECTION: Orderer
#
#   - This section defines the values to encode into a config transaction or
#   genesis block for orderer related parameters
#
################################################################################
Orderer: &OrdererDefaults

    # Orderer Type: The orderer implementation to start
    # Available types are "solo" and "kafka"
    OrdererType: solo

    Addresses:
        - orderer.example.com:7050

    # Batch Timeout: The amount of time to wait before creating a batch
    BatchTimeout: 2s

    # Batch Size: Controls the number of messages batched into a block
    BatchSize:

        # Max Message Count: The maximum number of messages to permit in a batch
        MaxMessageCount: 10

        # Absolute Max Bytes: The absolute maximum number of bytes allowed for
        # the serialized messages in a batch.
        AbsoluteMaxBytes: 98 MB

        # Preferred Max Bytes: The preferred maximum number of bytes allowed for
        # the serialized messages in a batch. A message larger than the preferred
        # max bytes will result in a batch larger than preferred max bytes.
        PreferredMaxBytes: 512 KB
```
* Refs:
  * https://stackoverflow.com/questions/50336505/what-is-the-size-of-the-default-block-on-hyperldger-fabric