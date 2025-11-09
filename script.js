document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const surveyForm = document.getElementById('surveyForm');
    const resultOutput = document.getElementById('resultOutput');
    const storageList = document.getElementById('storageList');
    const expertChatWindow = document.getElementById('expertChatWindow');
    const chatInput = document.getElementById('chatInput');
    const chatSendButton = document.getElementById('chatSendButton');

    // --- 1. Chức năng chuyển đổi Tab ---
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');

            // Cập nhật trạng thái active cho nút
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Chuyển đổi nội dung Tab
            tabContents.forEach(content => {
                if (content.id === tabId) {
                    content.classList.add('active');
                    content.classList.remove('hidden');
                } else {
                    content.classList.remove('active');
                    content.classList.add('hidden');
                }
            });
        });
    });

    // --- 2. Xử lý Form Khảo sát và Logic Micro-Treats ---
    surveyForm.addEventListener('submit', (event) => {
        event.preventDefault(); 
        
        const formData = new FormData(surveyForm);
        
        // Lấy điểm số và chuyển sang số nguyên
        const energy = parseInt(formData.get('energy_level') || 0);
        const sleep = parseInt(formData.get('sleep_quality') || 0);
        const focus = parseInt(formData.get('focus_ability') || 0);
        const totalScore = energy + sleep + focus; // Điểm tối đa: 15

        let recommendationTitle = "";
        let recommendationDesc = "";

        // Logic đánh giá dựa trên tổng điểm và mô hình Micro-Treats
        if (totalScore >= 12) {
            recommendationTitle = "Thật tuyệt vời! Micro-Treats: Micro-meets (Kết nối)";
            recommendationDesc = "Mức độ tinh thần của bạn rất tốt. Hãy duy trì bằng cách tổ chức 20 phút/tuần để kết nối sâu với bạn bè hoặc người thân.";
        } else if (totalScore >= 8) {
            recommendationTitle = "Khá ổn. Micro-Treats: Time-out (Nghỉ ngơi)";
            recommendationDesc = "Tinh thần ổn định, nhưng cần chú ý nghỉ ngơi. Dành 15 phút không dùng thiết bị điện tử sau mỗi 2 tiếng làm việc để nạp năng lượng.";
        } else {
            recommendationTitle = "Cần hỗ trợ. Micro-Treats: Journaling (Viết nhật ký)";
            recommendationDesc = "Điểm số khá thấp. Hãy dành 10 phút mỗi ngày để viết ra những suy nghĩ của bạn, hoặc tìm sự hỗ trợ từ Dr. OASIS (Tab Expert).";
        }

        const date = new Date().toISOString().slice(0, 10);
        
        // Cập nhật kết quả hiển thị
        resultOutput.innerHTML = `
            <p><strong>Ngày:</strong> ${date}</p>
            <p><strong>Tổng điểm:</strong> ${totalScore} / 15</p>
            <h3 class="recommendation-title">${recommendationTitle}</h3>
            <p class="recommendation-desc">${recommendationDesc}</p>
            <div class="result-suggestion">
                <p>OASIS LAB luôn sẵn lòng hỗ trợ bạn.</p>
                <hr class="scribble-line">
                <hr class="scribble-line">
            </div>
        `;

        // Lưu trữ kết quả (Mô phỏng lưu trữ trong Local Storage)
        const newEntry = document.createElement('li');
        newEntry.className = 'chat-item';
        newEntry.textContent = `${storageList.children.length + 1}. ${date}: Điểm ${totalScore}/15 (${recommendationTitle.split(': ')[1] || 'Tự đánh giá'})`;
        storageList.prepend(newEntry); // Thêm vào đầu danh sách
    });

    // --- 3. Chức năng Chat Tự động (Expert) ---
    chatSendButton.addEventListener('click', handleChatSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleChatSend();
        }
    });

    function handleChatSend() {
        const message = chatInput.value.trim();
        if (message === "") return;

        // 1. Hiển thị tin nhắn của người dùng
        appendMessage(message, 'user-bubble');

        // 2. Mô phỏng phản hồi tự động của AI (Dr. OASIS)
        chatInput.value = ''; // Xóa input
        setTimeout(() => {
            const aiResponse = generateAiResponse(message);
            appendMessage(aiResponse, 'expert-bubble');
        }, 1000); // Chờ 1 giây để mô phỏng xử lý
    }

    function appendMessage(text, className) {
        const messageElement = document.createElement('div');
        messageElement.textContent = text;
        messageElement.className = `chat-bubble ${className}`;
        expertChatWindow.appendChild(messageElement);
        // Cuộn xuống dưới cùng
        expertChatWindow.scrollTop = expertChatWindow.scrollHeight;
    }

    // Logic AI Expert đơn giản (có thể thay bằng Flask API gọi mô hình AI)
    function generateAiResponse(userMessage) {
        const lowerCaseMsg = userMessage.toLowerCase();
        if (lowerCaseMsg.includes("stress") || lowerCaseMsg.includes("căng thẳng")) {
            return "Tôi hiểu cảm giác của bạn. Hãy thử áp dụng kỹ thuật hít thở 4-7-8 để giảm căng thẳng ngay lập tức nhé!";
        } else if (lowerCaseMsg.includes("buồn") || lowerCaseMsg.includes("cô đơn")) {
            return "Cảm ơn bạn đã chia sẻ. Kết nối xã hội là quan trọng. Bạn có thể tham gia Micro-meets với bạn bè hoặc nói chuyện với một người đáng tin cậy.";
        } else if (lowerCaseMsg.includes("micro-meets")) {
            return "Micro-meets là việc dành 20 phút mỗi tuần để trò chuyện ý nghĩa với một người thân yêu. Nó giúp củng cố mối quan hệ và tăng cường cảm xúc tích cực.";
        } else if (lowerCaseMsg.includes("áp lực") || lowerCaseMsg.includes("đồng trang lứa")) {
             return "Micro-meets là việc dành 20 phút mỗi tuần để trò chuyện ý nghĩa với một người thân yêu. Nó giúp củng cố mối quan hệ và tăng cường cảm xúc tích cực. Đồng thời bạn cần phải hiểu rõ giá trị bản thân. Bao dung cho chính bản thân bạn";

        } else {
            return "Dr. OASIS ghi nhận phản hồi của bạn. Bạn muốn tôi giúp gì khác không? Hãy chia sẻ cảm xúc của bạn.";
     }
    }
});