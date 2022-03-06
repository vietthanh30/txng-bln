# Ordering Service

## What is ordering?
* Hầu hết các mạng Public Blockchain, chẳng hạn như Ethereum và Bitcoin, bất kỳ node nào cũng có thể tham gia vào quá trình đồng thuận ( consensus ). Hyperledger Fabric thì khác, nó có một loại node được gọi là một orderer (hay còn được gọi "ordering node" ), thực hiện nhiệm vụ "consensus", có thể là chỉ có 1 ordering node trong một network, hoặc có thể có nhiều node tạo nên 1 ordering service.

* Bởi vì thiết kế Hyperledger Fabric là dựa trên các thuật toán "deterministic consensus ", nên bất kỳ block nào đã được các peer validates và được tạo bởi ordering service thì đều được đảm bảo là chính xác. Ledger sẽ không thể xảy ra tình trạng rẽ nhánh như các blockchain khác.

* Ngoài vai trò trên, ordering service còn lưu trữ các thông tin khác như tổ chức nào được phép tạo channel, ai có thể thay đổi các cấu hình channel, và tất cả hành động thay đổi cấu hình đó đều phải đi qua orderer.

## Ordering service implementations

### Solo
* Chỉ có 1 orderer node duy nhất, nó không có khả năng *"fault tolerant" ( chịu lỗi )*. Vì thế nó chỉ dùng trong các project thử nghiệm, không nên dùng trong triển khai thực tế.

### Raft
* Kể từ version 1.4.1, HY ra mắt Raft là ordering serive có khả năng "fault tolenrant" (CFT) . Raft theo mô hình của một node "leader" và các node "followers", trong đó "leader" được bầu ra (trên mỗi channel) và các quyết định của nó sẽ được broadcast đến tất cả các "followers". Raft ordering service dễ dàng thiết lập và quản lý hơn Kafka ordering service và thiết kế của chúng cho phép các tổ chức có thể đóng góp các node cho ordering.

### Kafka
* Tương tự như Raft, Apache Kafka là một triển khai CFT sử dụng mô hình "leader and followers". Kafka sử dụng một nhóm ZooKeeper cho mục đích quản lý. Kafka có từ version 1.0, nhưng chi phí để thực hiện cao.


## Summary
* Nếu trển khai ở môi trường test cài đặt solo ordering service
* Nếu triển khai ở môi trường production cài đặt raft ordering service

# Refs
* https://github.com/IBM/raft-fabric-sample
* https://hyperledger-fabric.readthedocs.io/en/release-1.4/key_concepts.html
* https://hyperledger-fabric.readthedocs.io/en/release-2.2/orderer/ordering_service.html