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
      question: 'Pandas DataFrame에서 결측치가 있는 행을 제거하는 메서드는?',
      options: ['df.fillna()', 'df.dropna()', 'df.isna()', 'df.notna()'],
      correct: 1,
      explanation:
        'df.dropna()는 결측치가 있는 행을 제거하는 메서드입니다. fillna()는 결측치를 채우고, isna()와 notna()는 결측치를 확인하는 메서드입니다.',
    },
    {
      id: 2,
      question:
        '머신러닝에서 지도학습 모델의 학습에 사용되는 정답 데이터를 나타내는 용어는?',
      options: ['Feature', 'Label', 'Input', 'Parameter'],
      correct: 1,
      explanation:
        'Label(라벨)은 머신러닝에서 지도학습 모델의 학습에 사용되는 정답 데이터를 나타내는 용어입니다. Feature는 입력 특성, Input은 입력값, Parameter는 모델의 매개변수를 의미합니다.',
    },
    {
      id: 3,
      question:
        '[코딩 문제] 다음은 RAG 시스템에서 문서를 chunking하고 embedding 후 vector store를 생성하여 RAG 체인을 완성하는 과정입니다. 빈칸을 채워 완성해주세요.\n\n아래 코드에서 chunking된 텍스트를 embedding하여 vector store를 생성하는 부분의 빈칸을 채워주세요:',
      options: [],
      correct: -1,
      explanation:
        '정답: vectorstore = Chroma.from_documents(chunks, embeddings) 또는 vectorstore = Chroma.from_documents(documents=chunks, embedding=embeddings)',
      type: 'coding',
      codeTemplate: `from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

# 1. 문서 chunking
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)
chunks = text_splitter.split_documents(documents)

# 2. 임베딩 모델 초기화
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# 3. 벡터 저장소 생성 (빈칸을 채워주세요)
_______ = _________________

# 4. LLM 설정
openai_api_key = "OPENAI_API_KEY"
llm = ChatOpenAI(
    model_name="gpt-3.5-turbo",
    openai_api_key=openai_api_key,
    top_p=0.1
)

# 5. RAG 체인 구성
retriever = vectorstore.as_retriever()
template = '''Answer the question based only on the following context:
{context}
Question:
{question}'''
prompt = ChatPromptTemplate.from_template(template)
rag_chain = (
    {'context': retriever | format_docs, 'question': RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)`,
    },
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    const currentQ = questions[currentQuestion];
    let isCorrect = false;

    if (currentQ.type === 'coding') {
      // 코딩 문제 정답 체크
      const userCode = codeInput.toLowerCase().trim();
      const correctPatterns = [
        'vectorstore = chroma.from_documents(chunks, embeddings)',
        'vectorstore=chroma.from_documents(chunks,embeddings)',
        'vectorstore = chroma.from_documents(documents=chunks, embedding=embeddings)',
        'vectorstore = chroma.from_documents(chunks, embedding=embeddings)',
      ];
      isCorrect = correctPatterns.some(
        pattern =>
          userCode.includes(pattern.toLowerCase()) ||
          (userCode.includes('vectorstore') &&
            userCode.includes('chroma.from_documents') &&
            userCode.includes('chunks') &&
            userCode.includes('embeddings')),
      );
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
                      placeholder="예: vectorstore = Chroma.from_documents(chunks, embeddings)"
                      className="w-full h-24 sm:h-20 p-3 border border-gray-300 rounded-md font-mono text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-xs text-blue-700 mb-1">💡 힌트:</div>
                    <div className="text-xs text-blue-600">
                      chunking된 텍스트(chunks)와 임베딩 모델(embeddings)을
                      사용해서 벡터 저장소를 생성하세요.
                      <br />
                      Chroma.from_documents() 메서드를 사용해보세요.
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
                {(
                  questions[currentQuestion].type === 'coding'
                    ? codeInput.toLowerCase().includes('vectorstore') &&
                      codeInput
                        .toLowerCase()
                        .includes('chroma.from_documents') &&
                      codeInput.toLowerCase().includes('chunks') &&
                      codeInput.toLowerCase().includes('embeddings')
                    : selectedAnswer === questions[currentQuestion].correct
                ) ? (
                  <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-500 animate-pulse" />
                ) : (
                  <XCircle className="h-12 w-12 sm:h-16 sm:w-16 text-red-500 animate-pulse" />
                )}
              </div>

              <div className="space-y-2">
                <h3
                  className={`text-xl sm:text-2xl font-bold ${
                    (
                      questions[currentQuestion].type === 'coding'
                        ? codeInput.toLowerCase().includes('vectorstore') &&
                          codeInput
                            .toLowerCase()
                            .includes('chroma.from_documents') &&
                          codeInput.toLowerCase().includes('chunks') &&
                          codeInput.toLowerCase().includes('embeddings')
                        : selectedAnswer === questions[currentQuestion].correct
                    )
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {(
                    questions[currentQuestion].type === 'coding'
                      ? codeInput.toLowerCase().includes('vectorstore') &&
                        codeInput
                          .toLowerCase()
                          .includes('chroma.from_documents') &&
                        codeInput.toLowerCase().includes('chunks') &&
                        codeInput.toLowerCase().includes('embeddings')
                      : selectedAnswer === questions[currentQuestion].correct
                  )
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
