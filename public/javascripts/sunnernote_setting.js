const socket = io(); // 수정중

$(document).ready(function() {
    $('#summernote').summernote({
        height: 500,          
        minHeight: 300,         
        maxHeight: null,          
        focus: true,                 
        lang: "ko-KR",					
        spellCheck: false,
        toolbar: [
          ['style', ['bold', 'italic', 'underline','strikethrough', 'clear']],
          ['color', ['forecolor','color']],
          ['table', ['table']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['height', ['height']],
          ['insert',['picture','link','video']],
          ['codeview']
        ],
        callbacks: {
          onImageUpload : function(files) {
						sendImageFile(files[0]);
          }
        }
      });
  });

  // plain text만 전송하기위한 함수
  function testfunction() {
    document.getElementById("contents_plain").value = $($("#summernote").summernote("code")).text()
  }

  function sendImageFile(file) {
		let data = new FormData();
		data.append("file", file);
    data.append("socket", socket.id); // 소켓 ID를 data에 같이 넣어서 전송. 소켓으로 이미지 Url을 전송받기 위함
		$.ajax({
			data : data,
			type : "POST",
			url : "/upload/image",
			contentType : false,
			processData : false,
			success : function(data) {
			}
		});
	}

  // socket.io를 이용, 에디터에 이미지 삽입하는 함수
  socket.on('image_insert', function (data) {
      $('#summernote').summernote('insertImage', data.url);
  });