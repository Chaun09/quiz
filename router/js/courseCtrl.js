
app.controller("courseCtrl", function ($scope, $rootScope, $routeParams, $http, $interval) {
	sessionStorage.setItem('FrogQuiz-Sesion', '');
	localStorage.setItem("FrogQuiz-Cursor", "#course");


	$scope.indexquestion = 0;
	$scope.mark = 0;
	$scope.expression = [];

	$scope.checkOut = 0;

	$scope.userAnswers = [];
	$scope.systemAnswers = [];
	$scope.systemAnswerString = [];
	$scope.userAnswerString = [];
	$scope.checkFinish = false;

	$scope.cauTrl = [];

	$scope.replace = function () {
		$scope.cauTrl[$scope.indexquestion] = $scope.expression[$scope.indexquestion].answer;

	}

	$scope.point = 0;

	$scope.submit = function () {

		Swal.fire({
			title: 'Bạn có chắc không?',
			text: "Bạn thật sự muốn kết thúc bài thi!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: 'blue',
			cancelButtonColor: 'red',
			confirmButtonText: 'Có',
			cancelButtonText: 'Không'
		}).then((result) => {
			if (result.value) {
				$scope.checkOut = 1;
				$scope.checkFinish = true;
				$scope.timer = 3;
				sessionStorage.setItem('FrogQuiz-Sesion', 'course');
				for (var i = 0; i < $scope.Questions.length; i++) {
					// alert($scope.Questions[i].AnswerId+" "+$scope.cauTrl[i])
					if ($scope.Questions[i].AnswerId == $scope.cauTrl[i] && $scope.cauTrl[i] != undefined) {
						$scope.point++;
					}
				}

				$rootScope.Student.marks = angular.copy($scope.point + parseInt($rootScope.Student.marks));


				Swal.fire({
					title: 'Kết thúc bài thi',
					text: 'Tổng số điểm của bạn: ' + $scope.point,
					icon: 'success',
					showConfirmButton: false,
					closeOnClickOutside: false,
					allowOutsideClick: false,
					timer: 3000
				});
				/*
				<html>
					<button id="shareFacebook">Chia sẻ lên Facebook</button>
					<button id="shareTwitter">Chia sẻ lên Twitter</button>
					<button id="shareEmail">Chia sẻ qua Email</button>
				</html>
				$(document).ready(function(){
					// Hàm chia sẻ lên Facebook
					$("#shareFacebook").click(function(){
						var score = $("#score").text();
						var url = "https://www.facebook.com/sharer/sharer.php?u=https://example.com&quote=Điểm số của bạn là: " + score;
						window.open(url, "_blank");
					});
				
					// Hàm chia sẻ lên Twitter
					$("#shareTwitter").click(function(){
						var score = $("#score").text();
						var url = "https://twitter.com/intent/tweet?url=https://example.com&text=Điểm số của bạn là: " + score;
						window.open(url, "_blank");
					});
				
					// Hàm chia sẻ qua Email
					$("#shareEmail").click(function(){
						var score = $("#score").text();
						var subject = "Kết quả bài thi của bạn";
						var body = "Chào bạn,\n\nĐiểm số của bạn là: " + score + "\n\nRegards";
						var mailtoLink = "mailto:?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
						window.location.href = mailtoLink;
					});
				});
				*/

			}

		})

	}
	$scope.start = function () {
		if ($rootScope.Student == null) {
			showErrorToast();
			return;
		}
		$scope.timer = 600;
		$http.get('db/Quizs/' + $routeParams.id + '.json').then(function (response) {
			$scope.questions = response.data;
			ranDom();
		});
		$rootScope.Subjects.forEach(arr => {
			if (arr.Id == $routeParams.id) {
				$scope.subject = arr;
			}
		});

		function ranDom() {
			var dem = 0;
			$scope.Questions = [];
			for (var i = 0; i < 10; i++) {
				var ran = Math.floor(Math.random() * $scope.questions.length);
				$scope.Questions[dem] = $scope.questions[ran];
				$scope.questions.splice(ran, 1);
				dem++;
			}
			LoadAnswer(0);
			// move();
		}

		$scope.moveQuestion = function (x) {
			$scope.indexquestion = x;
			LoadAnswer($scope.indexquestion);
		}

		function LoadAnswer(x) {
			$scope.answers = angular.copy($scope.Questions[x].Answers);
		}
		var clock = $interval(function () {
			if ($scope.timer > 0) {
				$scope.timer -= 1;
			} else if ($scope.timer == 0) {
				if ($scope.checkOut == 0) {
					Swal.fire({
						title: 'Kết thúc bài thi',
						text: 'Tổng số điểm của bạn: ' + $scope.point,
						icon: 'success',
						showConfirmButton: false,
						closeOnClickOutside: false,
						allowOutsideClick: false,
						timer: 3000
					});

				}

				$scope.checkOut = 0;
				firebase.database().ref("user/" + $rootScope.Student.username).set($rootScope.Student);
				$interval.cancel(clock);
			}
		}, 1000);
	}


	// $scope.checkAnswer = function () {
	//     if ($scope.questions[$scope.indexquestion].AnswerId == $scope.expression[$scope.indexquestion].answer) {
	//         Swal.fire({
	//             icon: 'success',
	//             title: 'Bạn đã trả lời đúng!',
	//         });
	//         $scope.mark++;
	//     } else {
	//         Swal.fire({
	//             icon: 'error',
	//             title: 'Bạn đã trả lời sai!',
	//         });
	//     }
	// }


	// $scope.prev = function () {
	//     if ($scope.begin > 0) {
	//         $scope.begin -= 6;
	//     }
	// }

	// $scope.next = function () {

	//     if ($scope.begin < ($scope.pageCount - 1) * 6) {
	//         $scope.begin += 6;
	//     }
	// }

	function showErrorToast() {
		toast({
			title: "Thất bại!",
			message: "Vui lòng đăng nhập vào hệ thống để bắt đầu.",
			type: "error",
			duration: 5000
		});
	}
});