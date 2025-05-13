# Documentação Startup Explorer (caderno)

1. [Visão Geral](#visão-geral)
    > Objetivos, Público-alvo, tecnologias e estrutura (páginas)
2. [Funcionalidades](#funcionalidades)
3. [Estrutura (de arquivos)](#estrutura-de-arquivos)
4. [Instalação, contribuições e problemas](#instalação-contribuições-e-problemas)
5. [Acordo desenvolvimento](#acordo-de-desenvolvimento)
    > Guia para desenvolvedores sobre nomenclaturas de variáveis e funções estrutura de código, modulação e guia para atualizações.

## Visão Geral

<!-- Não esquecer de indicar o nome do site -->

Nota 10 permite que estudantes e instituições organizem conteúdos de forma interligada, facilitando o aprendizado e planejamento de cursos.  
Ele oferece ferramentas extremamente úteis para o nosso público alvo:  

São elas:  

**_plano de estudos_**.
> Esta como nome diz facilita a criação de planos de estudos e tarefas dentro deles para a organização.

**_foco de estudo_**.
> auxilia na anotação de material de estudo, assim como há criar relações entre eles para que façam sentido entre si.

Para desenvolver o site usamos:

- **HTML** para estruturação do site
- **CSS** para estilização
- **JavaScript** para dinamicidade
    - **localStorage** para o armazenamento de dados localmente

## Funcionalidades

- Formulário de comunicação/suporte ;
    > O usuário deve digitar seu nome, e-mail e a mensagem que quer enviar.
- Criação, remoção e edição de planos de estudos e de tarefas dentro deles;
    > O usuário informa um titulo para seu plano e posteriormente cria as tarefas que podem não estar organizadas ou se organizar por posição ou por data.
- Criação, remoção e edição de focos de estudos e, de relação entre eles que geralmente devem ser feitos com base em um palno de estudo;
    > O usuário define o título do foco, adiciona seu conteudo e se dejesar pode criar uma relação com outro foco. As relações são:  
    > - de pai, contém outro foco;
    > - de filho está contido em outro foco;
    > - periférica, exite uma relação mas nenhum contém o outro.

## Estrutura (de arquivos)

Exemplo:  

- **MAIN**

    - imagens - foto dos integrantes do grupo
        - juliana.jpg
        - paulo.jpg
        - pedro.jpg
    - index.html - página principal
    - ajuda.html - página com formulário de contato com suporte
    - sobre_nos.html - página com informações sobre o grupo de desenvolvimento
    - anotacoes.html
    - historico.html
    - plano_de_estudos.html
    - style.css - estilo do site
    - script.js - código para interatividade

## Instalação, contribuições e problemas

### Pré-requisitos

- Tenha um editor de código.
- Um navegador atualizado.
- Git instalado.
- Uma conta no Github.

### Para contribuir

1. Crie um fork deste projeto.
2. Acesse seu explorador de arquivos e encontre ou crie a pasta em que deseja abrir o arquivo;
3. com cursor em cima da pasta pressione o botão direito e clique em abrir no terminal;
4. no terminal digite: git clone https://github.com/JulianaDDeus/nota10.git
5. crie uma nova branch com o comando: git checkout -b nome_nova_branch.
6. Faça as alterações nos arquivos e ao terminar de editar digite os comandos no terminal com a pasta clone aberta:
    1. git add .
    2. git checkout -m "mensagem do commit"
    3. git push origin nome_nova_branch
7. entre na sua conta no github, vá para seu repositório do fork criado, selecione a branch que você criou e solicte a mudança para o criador do repositório clicando em contribute -> pull request.
8. agora espere o administrador do projeto autorizar a solicitação e você terá contribuido com ele.

### Problemas

Para reportar um problema faça isso pelo próprio Github.  
No canto superior direito há icone de circulo com um ponto no centro clique nele e na página redirecionada clique em **new issue** (novo problema), em seguida digite o erro encontrado e envie.

## Acordo de desenvolvimento

Comente a maior parte do código para ajudar os cooperadores a entende-lo.

### Conteudo HTML

- Preze sempre pela semântica das tags.  
- Estruture o código de maneira clara.  
- Mesmo que não seja sua função esteja sempre conciente de que seu conteúdo também será estilizado através de CSS e interativo através JS.
- Desenvolva de forma que seu código precise ser alterado o mínimo pelos responsáveis por cada tecnologia.
- Não limite os outros desenvolvedores, afinal seu trabalho é a base para eles.

### Estilização CSS

- Crie um layout simples e limpo.
- Deixe os botões, funções e outros elementos o mais intuitivo possível.
- O site precisa ser atrativo, mas cuidado com o excesso de elementos artísticos.
- Ofereça mais de um tema e tenha consciência das deficiêncis dos usuários.

### Interação JS

- Crie funções que possam ser reutilizados em diversas situações.
- Evite código morto e repetições.
- Dê nomes intuitivos as funções e variáveis.
- Organize tudo de modo que futuras mudanças não afetem o que já foi desenvolvido.
- Teste os elementos individualmente para confirmar que o código está bem separado e que, por exemplo, um erro na criação de foco de estudo não afete o formulário de suporte.

### Manutenção

Posteriomente pretendemos permitir o compartilhamento de planos e focos de estudo dentro do próprio site, também queremos melhorar os recursos para escrita de conteúdo de foco auxiliando seu entendimento.  

Para a manutenção siga as mesma indicações para cada tecnologia.