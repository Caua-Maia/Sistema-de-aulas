import { Sprint } from "@/types";

export const sprints: Sprint[] = [
  {
    id: "sprint-1",
    number: 1,
    title: "Lógica de Programação com JavaScript",
    description:
      "Aprenda os fundamentos da programação: variáveis, condicionais e loops. A base para tudo que vem depois!",
    lessons: [
      {
        id: "sprint-1-lesson-1",
        title: "O que é lógica de programação",
        description:
          "Entenda o que é pensar como programador e por que a lógica é o primeiro passo.",
        videoUrl: "https://www.youtube.com/embed/placeholder-logica",
        content:
          "Lógica de programação é a forma de organizar instruções passo a passo para resolver problemas. Antes de escrever código, você precisa entender o problema, dividir em partes menores e definir a ordem das ações. É como uma receita de bolo: cada passo depende do anterior.",
        challenge:
          "Escreva em um papel 5 passos para fazer um café. Depois, pense: algum passo depende de outro? Isso é lógica!",
        order: 1,
      },
      {
        id: "sprint-1-lesson-2",
        title: "Variáveis e tipos de dados",
        description:
          "Aprenda a guardar informações usando variáveis e conheça os tipos básicos.",
        videoUrl: "https://www.youtube.com/embed/placeholder-variaveis",
        content:
          "Variáveis são como caixas onde guardamos informações. Em JavaScript, usamos `let` e `const` para criar variáveis. Os tipos mais comuns são: string (texto), number (número), boolean (verdadeiro/falso) e undefined.",
        challenge:
          "Crie 4 variáveis: seu nome (string), sua idade (number), se gosta de programar (boolean) e uma variável vazia. Console.log cada uma!",
        order: 2,
      },
      {
        id: "sprint-1-lesson-3",
        title: "Condicionais com if e else",
        description:
          "Faça seu código tomar decisões com estruturas condicionais.",
        videoUrl: "https://www.youtube.com/embed/placeholder-condicionais",
        content:
          "Condicionais permitem que o programa escolha caminhos diferentes. Com `if`, `else if` e `else`, você verifica condições e executa código só quando elas são verdadeiras. Exemplo: se a nota for maior que 7, o aluno passa.",
        challenge:
          "Escreva um código que verifica se um número é par ou ímpar usando if/else. Teste com os números 4, 7 e 10.",
        order: 3,
      },
      {
        id: "sprint-1-lesson-4",
        title: "Loops com for e while",
        description:
          "Repita ações automaticamente usando laços de repetição.",
        videoUrl: "https://www.youtube.com/embed/placeholder-loops",
        content:
          "Loops repetem um bloco de código várias vezes. O `for` é ideal quando você sabe quantas vezes repetir. O `while` repete enquanto uma condição for verdadeira. Ambos economizam linhas e evitam repetição manual.",
        challenge:
          "Use um loop for para imprimir os números de 1 a 10 no console. Depois, use while para imprimir apenas os pares de 2 a 20.",
        order: 4,
      },
    ],
  },
  {
    id: "sprint-2",
    number: 2,
    title: "DOM e Manipulação de Elementos",
    description:
      "Conecte JavaScript às páginas web. Aprenda a selecionar e modificar elementos HTML.",
    lessons: [
      {
        id: "sprint-2-lesson-1",
        title: "O que é DOM",
        description:
          "Descubra como o navegador representa a página e como o JavaScript acessa ela.",
        videoUrl: "https://www.youtube.com/embed/placeholder-dom",
        content:
          "DOM (Document Object Model) é a representação em árvore de uma página HTML. Cada tag vira um nó que o JavaScript pode ler e modificar. Quando você muda o DOM, a página atualiza na hora — sem recarregar!",
        challenge:
          "Abra o DevTools (F12), vá na aba Elements e explore a árvore HTML de qualquer site. Identifique 3 tags diferentes.",
        order: 1,
      },
      {
        id: "sprint-2-lesson-2",
        title: "Selecionando elementos",
        description:
          "Use querySelector e getElementById para encontrar elementos na página.",
        videoUrl: "https://www.youtube.com/embed/placeholder-selecao",
        content:
          "`document.getElementById('id')` busca por ID. `document.querySelector('.classe')` busca o primeiro elemento que combina com o seletor CSS. `querySelectorAll` retorna todos os elementos encontrados.",
        challenge:
          "Crie uma página HTML com 3 parágrafos. Use querySelector para selecionar o segundo parágrafo e mude sua cor para azul.",
        order: 2,
      },
      {
        id: "sprint-2-lesson-3",
        title: "Alterando textos e estilos",
        description:
          "Modifique conteúdo e aparência dos elementos com JavaScript.",
        videoUrl: "https://www.youtube.com/embed/placeholder-estilos",
        content:
          "Use `element.textContent` para mudar texto e `element.style.propriedade` para alterar CSS inline. Para classes, use `classList.add()`, `classList.remove()` e `classList.toggle()`.",
        challenge:
          "Crie um botão que, ao ser clicado, muda o texto de um título para 'Texto alterado!' e aumenta o tamanho da fonte.",
        order: 3,
      },
      {
        id: "sprint-2-lesson-4",
        title: "Eventos de clique",
        description:
          "Faça a página reagir às ações do usuário com event listeners.",
        videoUrl: "https://www.youtube.com/embed/placeholder-eventos",
        content:
          "Eventos são ações do usuário: clique, tecla pressionada, mouse passando. Com `addEventListener('click', funcao)`, você define o que acontece quando o evento ocorre. É assim que botões, menus e formulários funcionam!",
        challenge:
          "Crie 3 botões coloridos. Cada um deve mudar a cor de fundo da página ao ser clicado. Use addEventListener.",
        order: 4,
      },
    ],
  },
  {
    id: "sprint-3",
    number: 3,
    title: "Funções, Arrays e Objetos",
    description:
      "Organize seu código com funções reutilizáveis e estruturas de dados poderosas.",
    lessons: [
      {
        id: "sprint-3-lesson-1",
        title: "Criando funções",
        description:
          "Aprenda a encapsular lógica em blocos reutilizáveis.",
        videoUrl: "https://www.youtube.com/embed/placeholder-funcoes",
        content:
          "Funções são blocos de código que executam uma tarefa específica. Você declara com `function nome() {}` ou `const nome = () => {}`. Funções recebem parâmetros e podem retornar valores com `return`.",
        challenge:
          "Crie uma função `dobrar(numero)` que retorna o dobro do valor. Teste com 5, 10 e 15. Depois crie `saudacao(nome)` que retorna 'Olá, [nome]!'",
        order: 1,
      },
      {
        id: "sprint-3-lesson-2",
        title: "Trabalhando com arrays",
        description:
          "Armazene listas de dados e use métodos como map, filter e forEach.",
        videoUrl: "https://www.youtube.com/embed/placeholder-arrays",
        content:
          "Arrays guardam listas ordenadas: `const frutas = ['maçã', 'banana']`. Métodos úteis: `push()` adiciona, `pop()` remove o último, `forEach()` itera, `map()` transforma cada item e `filter()` seleciona itens.",
        challenge:
          "Crie um array com 5 nomes. Use map para criar um novo array com 'Olá, ' antes de cada nome. Use filter para pegar só nomes com mais de 4 letras.",
        order: 2,
      },
      {
        id: "sprint-3-lesson-3",
        title: "Objetos em JavaScript",
        description:
          "Organize dados relacionados em estruturas de chave-valor.",
        videoUrl: "https://www.youtube.com/embed/placeholder-objetos",
        content:
          "Objetos agrupam propriedades: `const aluno = { nome: 'Ana', idade: 20 }`. Acesse com `aluno.nome` ou `aluno['idade']`. Objetos representam entidades do mundo real: usuários, produtos, configurações.",
        challenge:
          "Crie um objeto `carro` com marca, modelo e ano. Adicione um método `info()` que retorna uma string descritiva. Chame o método no console.",
        order: 3,
      },
      {
        id: "sprint-3-lesson-4",
        title: "Mini desafio integrador",
        description:
          "Combine tudo que aprendeu em um projeto prático.",
        videoUrl: "https://www.youtube.com/embed/placeholder-desafio",
        content:
          "Hora de juntar variáveis, condicionais, loops, DOM, funções, arrays e objetos! Neste desafio, você vai criar uma lista de tarefas simples (to-do list) que adiciona, remove e marca itens como concluídos.",
        challenge:
          "Crie uma to-do list: input para nova tarefa, botão adicionar, lista de tarefas com botão de remover. Use array de objetos `{ texto, concluida }`. Bônus: marque tarefas como concluídas com riscado.",
        order: 4,
      },
    ],
  },
];

export function getSprintById(sprintId: string): Sprint | undefined {
  return sprints.find((s) => s.id === sprintId);
}

export function getLessonById(
  sprintId: string,
  lessonId: string
): { sprint: Sprint; lesson: import("@/types").Lesson } | undefined {
  const sprint = getSprintById(sprintId);
  if (!sprint) return undefined;
  const lesson = sprint.lessons.find((l) => l.id === lessonId);
  if (!lesson) return undefined;
  return { sprint, lesson };
}

export function getAllLessons() {
  return sprints.flatMap((s) => s.lessons);
}

export function getTotalLessonsCount(): number {
  return getAllLessons().length;
}
