# RemediosJa


![remediosJa](https://github.com/user-attachments/assets/69982ccc-49c5-41e2-b6bf-66be688c05a2)

# RemediosJa 💊

Aplicativo mobile desenvolvido em React Native com Expo para simular um e-commerce de farmácia, incluindo funcionalidades de busca avançada, gestão de carrinho e histórico de pedidos persistente.

## 📱 Funcionalidades Principais

### 1. Fluxo de Pedido Completo
O aplicativo gerencia todo o ciclo de vida de um pedido, garantindo uma experiência fluida e segura:
- **Adição ao Carrinho**: Produtos podem ser adicionados a partir da tela inicial ou da busca. O carrinho persiste globalmente durante a sessão.
- **Checkout Seguro**: Ao tentar finalizar um pedido, o sistema verifica automaticamente se o usuário está autenticado.
  - *Sem Login*: O usuário é redirecionado para a tela de login/cadastro.
  - *Com Login*: O pedido é processado, salvo no banco de dados local com status inicial de **"Preparando"** e vinculado ao ID do usuário.
- **Histórico**: Na aba "Pedidos", o usuário visualiza o histórico completo de suas compras, com detalhes dos itens e status atual.

### 2. Busca com Filtro (Bottom Sheet)
Para facilitar a localização de produtos, implementamos um sistema de filtros robusto:
- **Interface**: Um *Bottom Sheet* (modal que sobe da parte inferior) permite selecionar filtros de forma intuitiva.
- **Filtros Disponíveis**:
  - Categorias (Medicamentos, Saúde, Bebê, etc.).
  - Faixa de Preço Máximo.
- **Sincronização de Estado**: O filtro "lembra" as opções selecionadas anteriormente, mantendo a coerência visual ao reabrir o menu de filtros.
- **Integração com Banco de Dados**: A busca aplica os filtros diretamente na query SQL para retornar apenas os resultados relevantes.

### 3. Fluxo de Cliente e Perfil Inteligente
O gerenciamento de usuários foi projetado para ser simples e direto:
- **Acesso Condicional**: A aba "Perfil" atua como um gerenciador de rotas inteligente.
  - Se o usuário **não** estiver logado, ela renderiza a tela de **Login**.
  - Se o usuário **estiver** logado, ela exibe o **Painel do Usuário** com suas estatísticas (total de pedidos, economia, etc.).
- **Autenticação Persistente**: O estado do usuário é gerenciado via Context API e persistido localmente, mantendo o usuário logado mesmo após fechar o app.

---

## 🚀 Como Rodar o Projeto

Para executar este projeto em sua máquina, siga os passos abaixo estritamente para garantir que todas as dependências sejam carregadas corretamente.

### Pré-requisitos
- Node.js instalado.
- Gerenciador de pacotes `npm`.
- Aplicativo **Expo Go** no seu celular ou um emulador (Android Studio/Xcode) configurado.

### Passo a Passo

1. **Acesse o diretório do projeto**
   É fundamental que você esteja dentro da pasta raiz do aplicativo Expo (`RemediosJa`) antes de rodar qualquer comando.
   ```bash
   cd RemediosJa

2. **Instale as dependencias**
  apos ter certeza que esta no diretorio correto do expo, instale as dependencias com o seguinte comando
  ```bash
  npm install
```
3. **Executar o App**
   Após a instalação terminar, inicie o servidor do Metro Bundler com o comando:
```Bash
  npm start
```
### Passo 4: Testar no Dispositivo*
  **No Celular**: Baixe o app Expo Go na Play Store (Android) ou App Store (iOS) e escaneie o QR Code exibido no terminal.
  **No Emulador**: Pressione a no terminal para abrir no Android Emulator ou i para o iOS Simulator.

🛠️ Tecnologias Utilizadas
    **React Native & Expo SDK 54**
    **Expo SQLite:** Para banco de dados local.
    **React Navigation:** Navegação em Stack e Tabs.
    **Context API:** Gerenciamento de estado global (Auth e Carrinho).
    **TypeScript:** Para tipagem estática e segurança do código.
