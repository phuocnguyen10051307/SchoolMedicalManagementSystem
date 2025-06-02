// Để tải dự án và làm việc bạn cần làm các bước sau 

git clone https://github.com/phuocnguyen10051307/SchoolMedicalManagementSystem.git  (nó dùng để clone dự án code về)
git pull origin main (cập nhập code mới nhất từ nhánh main )
git chechout -b <--tên nhánh của bạn chỗ này nên đặt tên hợp lí -->   (câu lệnh này vừa tạo một nhánh mới từ nhánh chính và nó tự chuyển qua nhánh bạn vừa  tạo )
git branch (sau khi làm xong câu lệnh trên và check xem nó đã được tạo chưa  dấu * là nó đang ở nhánh đó )



// sau khi code xong các bước để upload code mới hay từng chức năng để lưu trữ bạn cần thực hiện các bước sau 
git add [tên file]  (đây là câu lệnh upload từng file code vừa mới viết )
git add . (đây là câu lệnh giúp bạn upload code tất cả các file bạn vừa thay đổi hay làm chức năng trong code  )
git commit -m "<trong đây chứa các tin nhắn, bạn nên ghi lại khi hoàn thành 1 task nào đó >"
git push origin <-- tên nhánh của bạn -->  (có thể dùng câu lệnh này xuyên dự án cũng được không cần để ý 2 câu lệnh dưới )

git push -u origin <-- tên nhánh bạn đã của bạn đã tạo  --> (câu lệnh này dùng lần 1 thôi )
git push(dùng cho lần 2 và tất cả lần sau của upload code vì câu lệnh trên -u: viết tắt của --set-upstream nó thiết lập mối quan hệ đặc biệt với nhánh của bạn push lên git và không cần chỉ định orign tên nhánh nữa )


// những việc gộp code chỉ có tui làm nên mọi người không cần làm 
