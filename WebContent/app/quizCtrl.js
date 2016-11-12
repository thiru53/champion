var quizCtrl = function ($scope, $http, helper,$sce) {
    $scope.quizName = 'data/csharp.json';

	$scope.score = 0;
	$scope.activeQuestion = -1;
	$scope.activeQuestionAnswered = 0;
	$scope.percentage = 0;
	
    //Note: Only those configs are functional which is documented at: http://www.codeproject.com/Articles/860024/Quiz-Application-in-AngularJs
    // Others are work in progress.
    $scope.defaultConfig = {
        'allowBack': true,
        'allowReview': true,
        'autoMove': false,  // if true, it will move to next question automatically when answered.
        'duration': 0,  // indicates the time in which quiz needs to be completed. post that, quiz will be automatically submitted. 0 means unlimited.
        'pageSize': 1,
        'requiredAll': false,  // indicates if you must answer all the questions before submitting.
        'richText': false,
        'shuffleQuestions': false,
        'shuffleOptions': false,
        'showClock': false,
        'showPager': true,
        'theme': 'none'
    }

    $scope.goTo = function (index) {
        if (index > 0 && index <= $scope.totalQuestions) {
            $scope.currentPage = index;
            $scope.mode = 'quiz';
        }
    }

	$scope.selectAnswer = function(qIndex,aIndex){
		//alert(qIndex +"'and'"+ aIndex);
		var questionState = $scope.questions[qIndex].questionState;
		
		if( questionState != 'answered' ){
			
			$scope.questions[qIndex].selectedAnswer = aIndex;
			var correctAnswer = $scope.questions[qIndex].correct;
			$scope.questions[qIndex].correctAnswer = correctAnswer;
			
			if( aIndex === correctAnswer){
				$scope.questions[qIndex].correctness = 'correct';
				$scope.score += 1;
				
			}else{
				$scope.questions[qIndex].correctness = 'incorrect';
			}
			$scope.questions[qIndex].questionState = 'answered';
		}
		$scope.percentage = (($scope.score/$scope.totalQuestions)*100).toFixed(2);
		

            
	}
	$scope.isSelected = function(qIndex,aIndex){
		return $scope.questions[qIndex].selectedAnswer === aIndex;
	}
	
	$scope.isCorrect = function(qIndex,aIndex){
		return $scope.questions[qIndex].correctAnswer === aIndex;
	}
	$scope.selectContinue = function(){
        if ($scope.config.autoMove == true && $scope.currentPage < $scope.totalQuestions)
            $scope.currentPage++;
		return $scope.activeQuestion += 1;
	}
	
	$scope.createShareLinks = function(percentage){
		var url = "http://codifydesign.com";
		var text ="I scoreda a "+percentage+"% on this quiz about Saturn. Try to beat my score at "+url;
		
		var emailLink =   '<a class="btn email" href="mailto:?subject=Try to beat my quiz score!&amp;body='+text+'">Email a Friend</a>';
		var twitterLink = '<a class="btn twitter" target="_blank" href="https://twitter.com/share?text=I scored a '+percentage+' percentage on this quiz ">Tweet your score</a>';
		var facebookLink = '<a class="btn facebook" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=example.org" > Share on Facebook </a>';
		
		var newMarkup = emailLink + twitterLink+facebookLink;
		
		return $sce.trustAsHtml(newMarkup)
	}
	
    $scope.onSelect = function (question, option) {
        if (question.QuestionTypeId == 1) {
            question.Options.forEach(function (element, index, array) {
                if (element.Id != option.Id) {
                    element.Selected = false;
                    //question.Answered = element.Id;
                }
            });
        }

        if ($scope.config.autoMove == true && $scope.currentPage < $scope.totalQuestions)
            $scope.currentPage++;
    }

    $scope.onSubmit = function () {
        var answers = [];
        $scope.questions.forEach(function (q, index) {
            answers.push({ 'QuizId': $scope.quiz.Id, 'QuestionId': q.Id, 'Answered': q.Answered });
        });
        // Post your data to the server here. answers contains the questionId and the users' answer.
        //$http.post('api/Quiz/Submit', answers).success(function (data, status) {
        //    alert(data);
        //});
        console.log($scope.questions);
        $scope.mode = 'result';
    }

    $scope.pageCount = function () {
        return Math.ceil($scope.questions.length / $scope.itemsPerPage);
    };

    //If you wish, you may create a separate factory or service to call loadQuiz. To keep things simple, i have kept it within controller.
    $scope.loadQuiz = function (file) {
        $http.get(file)
         .then(function (res) {
             $scope.quiz = res.data.quiz;
             $scope.config = helper.extend({}, $scope.defaultConfig, res.data.config);
             $scope.questions = $scope.config.shuffleQuestions ? helper.shuffle(res.data.questions) : res.data.questions;
             $scope.totalQuestions = $scope.questions.length;
             $scope.itemsPerPage = $scope.config.pageSize;
             $scope.currentPage = 1;
             $scope.mode = 'quiz';

             $scope.$watch('currentPage + itemsPerPage', function () {
                 var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
                   end = begin + $scope.itemsPerPage;

                 $scope.myQuestions = $scope.questions.slice(begin, end);
             });
         });
    }
    $scope.loadQuiz($scope.quizName);

    $scope.isAnswered = function (index) {
        var answered = 'Not Answered';
        $scope.questions[index].Options.forEach(function (element, index, array) {
            if (element.Selected == true) {
                answered = 'Answered';
                return false;
            }
        });
        return answered;
    };
    /**
    $scope.isCorrect = function (question) {
        var result = 'correct';
        question.Options.forEach(function (option, index, array) {
            if (helper.toBool(option.Selected) != option.IsAnswer) {
                result = 'wrong';
                return false;
            }
        });
        return result;
    };*/
}

quizCtrl.$inject = ['$scope', '$http', 'helperService','$sce'];
app.controller('quizCtrl', quizCtrl);