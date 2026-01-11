
import { MathTopic, MathModel } from './types';

export const INITIAL_MODELS: MathModel[] = [
  {
    id: 'geometry-deform',
    topic: MathTopic.GEOMETRY,
    title: '核心：多边形变形面积模型',
    description: '通过研究图形在变形（如拉伸、平移）过程中底和高的变化，掌握面积变化的规律。',
    exampleProblem: '一个平行四边形的底是10厘米，高是6厘米。如果把它拉成一个长方形，底不变，周长也不变，但高变成了8厘米。请问变形后面积增加了多少平方厘米？',
    steps: [
      {
        title: '计算原始面积',
        explanation: '平行四边形的面积公式是：底 × 高。',
        question: '底10厘米，高6厘米，原来的面积是多少？',
        hint: '10 * 6 = ?',
        correctAnswer: '60'
      },
      {
        title: '计算变形后面积',
        explanation: '拉成长方形后，底依然是10厘米，但题目说高变成了8厘米。长方形面积也是：长 × 宽（即底 × 高）。',
        question: '底10厘米，新高8厘米，现在的面积是多少？',
        hint: '10 * 8 = ?',
        correctAnswer: '80'
      },
      {
        title: '比较面积变化',
        explanation: '面积增加了多少，就是用现在的面积减去原来的面积。',
        question: '80 - 60 等于多少平方厘米？',
        hint: '直接相减即可。',
        correctAnswer: '20'
      }
    ],
    followUpProblem: '如果一个三角形的底扩大到原来的2倍，高缩小到原来的一半，它的面积会发生变化吗？'
  },
  {
    id: 'travel-meeting',
    topic: MathTopic.WORD_PROBLEMS,
    title: '逻辑：相遇行程模型',
    description: '通过“速度和”的概念，解决两个物体从两地出发相向而行的时间与距离问题。',
    exampleProblem: '甲、乙两地相距480千米。客车和货车同时从两地相对开出，客车每小时行70千米，货车每小时行50千米。经过几小时两车相遇？',
    steps: [
      {
        title: '理解速度和',
        explanation: '相向而行时，两辆车每小时共同拉近的距离就是它们的“速度之和”。',
        question: '客车每小时70km，货车每小时50km，它们的总速度（速度和）是多少？',
        hint: '70 + 50 = ?',
        correctAnswer: '120'
      },
      {
        title: '建立时间模型',
        explanation: '相遇时间 = 总路程 ÷ 速度和。',
        question: '总距离是480千米，速度和是120千米/小时。需要多少小时相遇？',
        hint: '480 / 120 = ?',
        correctAnswer: '4'
      },
      {
        title: '验证距离',
        explanation: '我们可以反过来算，4小时里客车走了多远？',
        question: '客车每小时70km，走了4小时，它行驶了多少千米？',
        hint: '70 * 4 = ?',
        correctAnswer: '280'
      }
    ],
    followUpProblem: '如果是“追及问题”，速度应该用加法还是减法呢？试试看如果客车追货车需要多久。'
  },
  {
    id: '5',
    topic: MathTopic.WORD_PROBLEMS,
    title: '经典：鸡兔同笼模型',
    description: '通过假设法解决含有两个未知量的问题。',
    exampleProblem: '笼子里有鸡和兔子共10只，总共有32条腿。请问鸡和兔子各有多少只？',
    steps: [
      {
        title: '大胆假设',
        explanation: '我们先假设笼子里全是鸡。因为每只鸡有2条腿。',
        question: '如果10只全是鸡，总共有多少条腿？',
        hint: '10 * 2 = ?',
        correctAnswer: '20'
      },
      {
        title: '寻找差异',
        explanation: '实际有32条腿，比我们假设的20条腿多了12条。这是因为兔子比鸡每只多2条腿。',
        question: '用多出来的12条腿除以每只兔子多出的2条腿，可以得到几只兔子？',
        hint: '12 / 2 = ?',
        correctAnswer: '6'
      },
      {
        title: '得出结论',
        explanation: '既然有6只兔子，剩下的就是鸡了。',
        question: '10只总数减去6只兔子，剩下几只鸡？',
        hint: '10 - 6 = ?',
        correctAnswer: '4'
      }
    ],
    followUpProblem: '如果总共有20只头，54条腿，你能用同样的方法算出鸡和兔子的数量吗？'
  },
  {
    id: '6',
    topic: MathTopic.DECIMALS,
    title: '生活数学：停车费模型',
    description: '掌握分段计费的逻辑，区分起步价和超出部分的单价。',
    exampleProblem: '某停车场收费标准：1小时内收费5元；超过1小时的部分，每小时收费2.5元。小明停车3.5小时，应付多少钱？',
    steps: [
      {
        title: '分段拆解',
        explanation: '首先要把时间分成两部分：1小时的基础时间和超出的时间。',
        question: '3.5小时减去基础的1小时，超出了多少小时？',
        hint: '3.5 - 1 = ?',
        correctAnswer: '2.5'
      },
      {
        title: '计算超出费用',
        explanation: '超出的部分每小时2.5元。',
        question: '2.5小时 * 2.5元/小时 等于多少元？',
        hint: '2.5 * 2.5 = ?',
        correctAnswer: '6.25'
      },
      {
        title: '汇总总价',
        explanation: '总费用 = 基础费 + 超出费。',
        question: '5元 + 6.25元 等于多少元？',
        hint: '5 + 6.25 = ?',
        correctAnswer: '11.25'
      }
    ],
    followUpProblem: '如果停车4小时，费用会是多少？'
  },
  {
    id: '7',
    topic: MathTopic.GEOMETRY,
    title: '立体几何：粉刷教室模型',
    description: '计算长方体表面积时，学会根据实际情况扣除不需要计算的面。',
    exampleProblem: '教室长8米，宽6米，高3米。要粉刷四周墙壁和顶棚，门窗面积共12平方米。粉刷面积是多少？',
    steps: [
      {
        title: '确定需要粉刷的面',
        explanation: '教室是一个长方体，但地面不需要粉刷。所以我们要算的是：顶棚 + 四周墙壁。',
        question: '顶棚是一个长8米宽6米的长方形，它的面积是多少？',
        hint: '8 * 6 = ?',
        correctAnswer: '48'
      },
      {
        title: '计算侧面积',
        explanation: '四周墙壁包括两个（长*高）和两个（宽*高）。',
        question: '侧面积 (8*3*2 + 6*3*2) 等于多少平方米？',
        hint: '48 + 36 = ?',
        correctAnswer: '84'
      },
      {
        title: '最后去皮',
        explanation: '总粉刷面积 = 顶棚 + 侧面积 - 门窗面积。',
        question: '48 + 84 - 12 等于多少？',
        hint: '132 - 12 = ?',
        correctAnswer: '120'
      }
    ],
    followUpProblem: '如果要在教室四周贴1.2米高的瓷砖，那瓷砖的面积该怎么算？'
  }
];
