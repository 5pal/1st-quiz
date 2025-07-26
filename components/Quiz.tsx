'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, RotateCcw, Trophy, XCircle } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<
    Array<{
      questionId: number;
      selected: number | string | null;
      correct: boolean;
    }>
  >([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [codeInput, setCodeInput] = useState('');

  const questions = [
    {
      id: 1,
      question:
        'LangChain의 LCEL(LangChain Expression Language) Runnables에 대한 설명으로 올바른 것은?',
      options: [
        'Runnables는 단순히 함수를 실행하는 기능만 제공한다',
        'pipe() 메서드를 사용하여 여러 Runnable을 체인으로 연결할 수 있다',
        'Runnables는 동기적으로만 실행되며 비동기 처리를 지원하지 않는다',
        'invoke() 메서드는 배치 처리에만 사용되고 단일 입력에는 사용할 수 없다',
      ],
      correct: 1,
      explanation:
        'LCEL Runnables의 핵심 특징은 pipe() 메서드를 통해 여러 컴포넌트를 체인으로 연결할 수 있다는 것입니다. 또한 invoke(), batch(), stream() 등 다양한 실행 방식을 지원합니다.',
    },
    {
      id: 2,
      question:
        "LangChain의 RecursiveCharacterTextSplitter에서 'chunk_overlap' 매개변수의 역할은 무엇인가요?",
      options: [
        '분할된 청크들 간에 겹치는 문자 수를 지정하여 문맥 연속성을 유지한다',
        '전체 텍스트에서 중복되는 문자들을 제거하는 기능을 수행한다',
        '청크의 최대 크기를 넘어서는 문자 수를 정의한다',
        '분할 시 사용할 구분자(separator)의 우선순위를 결정한다',
      ],
      correct: 0,
      explanation:
        'chunk_overlap은 인접한 청크들 사이에 겹치는 문자 수를 지정합니다. 이를 통해 문맥이 끊어지는 것을 방지하고 정보의 연속성을 유지할 수 있습니다.',
    },
    {
      id: 3,
      question:
        '[코딩 문제] 다음 n8n 워크플로우에서 이메일 주소에서 사용자명만 추출하는 표현식을 완성해주세요.',
      options: [],
      correct: -1,
      explanation: "정답: email.split('@')[0]",
      type: 'coding',
      codeTemplate: `// n8n 워크플로우: 웹페이지 크롤링 및 데이터 추출

{
  "nodes": [
    {
      "name": "HTTP Request",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://example.com/contact",
        "requestMethod": "GET"
      }
    },
    {
      "name": "Extract HTML Data",
      "type": "n8n-nodes-base.htmlExtract",
      "parameters": {
        "extractionValues": {
          "values": [
            {
              "key": "email",
              "cssSelector": ".contact-email",
              "returnValue": "text"
            }
          ]
        }
      }
    },
    {
      "name": "Process Email",
      "type": "n8n-nodes-base.set",
      "parameters": {
        "values": {
          "string": [
            {
              "name": "username",
              "value": "={{ $json._______}}"  // 빈칸: 이메일에서 @ 앞부분만 추출
            }
          ]
        }
      }
    }
  ]
}

// 예상 데이터:
// email: "john.doe@company.com"
// 
// 결과:
// username: "john.doe"`,
      blanks: [
        {
          id: 1,
          label: '이메일에서 사용자명 추출 ($json 이후 부분)',
          answer: "email.split('@')[0]",
        },
      ],
    },
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    const currentQ = questions[currentQuestion];
    let isCorrect = false;

    if (currentQ.type === 'coding') {
      // 단일 빈칸 정답 체크
      const userAnswer = codeInput.toLowerCase().trim();
      const correctAnswer = currentQ.blanks[0].answer.toLowerCase();
      isCorrect = userAnswer === correctAnswer;
    } else {
      isCorrect = selectedAnswer === currentQ.correct;
    }

    const newAnswers = [
      ...answers,
      {
        questionId: currentQ.id,
        selected: currentQ.type === 'coding' ? codeInput : selectedAnswer,
        correct: isCorrect,
      },
    ];

    setAnswers(newAnswers);
    if (isCorrect) {
      setScore(score + 1);
    }

    setShowResult(true);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setCodeInput('');
        setShowResult(false);
      } else {
        setQuizCompleted(true);
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setCodeInput('');
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setQuizCompleted(false);
  };

  const getScoreColor = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return '훌륭합니다! 🎉';
    if (percentage >= 60) return '좋습니다! 👍';
    return '더 열심히 공부해보세요! 💪';
  };

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4 flex items-center justify-center">
        <Card className="w-full max-w-2xl mx-auto shadow-xl">
          <CardHeader className="text-center px-4 sm:px-6">
            <div className="flex justify-center mb-4">
              <Trophy className="h-12 w-12 sm:h-16 sm:w-16 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              퀴즈 완료!
            </CardTitle>
            <CardDescription className="text-base sm:text-lg mt-2">
              수고하셨습니다!
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6 px-4 sm:px-6">
            <div className="space-y-4">
              <div
                className={`text-4xl sm:text-6xl font-bold ${getScoreColor()}`}
              >
                {score}/{questions.length}
              </div>
              <div className="text-lg sm:text-2xl font-semibold text-gray-700">
                {getScoreMessage()}
              </div>
              <div className="text-base sm:text-lg text-gray-600">
                정답률: {Math.round((score / questions.length) * 100)}%
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-3">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
                결과 요약
              </h3>
              {questions.map((question, index) => {
                const answer = answers[index];
                return (
                  <div
                    key={question.id}
                    className="flex items-center justify-between p-2 bg-white rounded border"
                  >
                    <span className="text-xs sm:text-sm font-medium">
                      문제 {index + 1}
                    </span>
                    <div className="flex items-center space-x-2">
                      {answer.correct ? (
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                      )}
                      <Badge
                        variant={answer.correct ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {answer.correct ? '정답' : '오답'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button onClick={resetQuiz} className="w-full" size="lg">
              <RotateCcw className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              다시 시도하기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4 flex items-center justify-center relative">
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader className="px-4 sm:px-6">
          <div className="flex justify-between items-center mb-4">
            <Badge variant="outline" className="text-xs sm:text-sm">
              문제 {currentQuestion + 1} / {questions.length}
            </Badge>
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>현재 점수: {score}</span>
            </div>
          </div>
          <Progress
            value={(currentQuestion / questions.length) * 100}
            className="mb-6"
          />
          <CardTitle className="text-lg sm:text-xl font-bold leading-relaxed">
            {questions[currentQuestion].question}
          </CardTitle>
        </CardHeader>

        <CardContent className="px-4 sm:px-6">
          {!showResult ? (
            <div className="space-y-4">
              {questions[currentQuestion].type === 'coding' ? (
                // 코딩 문제 UI
                <div className="space-y-4">
                  <div className="bg-gray-100 p-3 sm:p-4 rounded-lg border">
                    <pre className="text-xs sm:text-sm text-gray-800 whitespace-pre-wrap font-mono overflow-x-auto">
                      {questions[currentQuestion].codeTemplate}
                    </pre>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      빈칸에 들어갈 코드를 입력하세요:
                    </label>
                    <textarea
                      value={codeInput}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setCodeInput(e.target.value)
                      }
                      placeholder="여기에 코드를 입력하세요..."
                      className="w-full h-24 sm:h-20 p-3 border border-gray-300 rounded-md font-mono text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-xs text-blue-600">
                      💡 힌트:{' '}
                      {questions[currentQuestion].type === 'coding' &&
                      currentQuestion === 2
                        ? "이메일 주소를 '@' 기준으로 나누고 첫 번째 부분을 가져오는 JavaScript 메서드를 사용하세요. (예: 문자열.split('구분자')[인덱스])"
                        : null}
                      <br />
                    </div>
                  </div>
                </div>
              ) : (
                // 객관식 문제 UI
                questions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === index ? 'default' : 'outline'}
                    className={`w-full text-left justify-start p-3 sm:p-4 h-auto hover:scale-105 transition-transform ${
                      selectedAnswer === index ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          selectedAnswer === index
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedAnswer === index && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-left break-words">
                        {option}
                      </span>
                    </div>
                  </Button>
                ))
              )}

              <Button
                onClick={handleNextQuestion}
                disabled={
                  questions[currentQuestion].type === 'coding'
                    ? !codeInput.trim()
                    : selectedAnswer === null
                }
                className="w-full mt-6"
                size="lg"
              >
                {currentQuestion === questions.length - 1
                  ? '완료'
                  : '다음 문제'}
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                {answers[answers.length - 1]?.correct ? (
                  <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-500 animate-pulse" />
                ) : (
                  <XCircle className="h-12 w-12 sm:h-16 sm:w-16 text-red-500 animate-pulse" />
                )}
              </div>

              <div className="space-y-2">
                <h3
                  className={`text-xl sm:text-2xl font-bold ${
                    answers[answers.length - 1]?.correct
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {answers[answers.length - 1]?.correct
                    ? '정답입니다!'
                    : '틀렸습니다!'}
                </h3>

                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-left">
                  <p className="text-xs sm:text-sm font-medium text-gray-800 mb-2">
                    해설:
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {questions[currentQuestion].explanation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 모바일에서는 아바타 숨기기 또는 작게 표시 */}
      <Avatar className="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10">
        <AvatarImage src="https://github.com/5pal.png" />
        <AvatarFallback className="text-xs">Kim</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default Quiz;
