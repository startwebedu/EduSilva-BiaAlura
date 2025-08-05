// Palavras comuns em português para filtrar
const stopWords = new Set([
  'a', 'o', 'e', 'é', 'de', 'do', 'da', 'em', 'um', 'uma', 'para', 'com', 'não', 'na', 'no', 'se', 'que', 'por', 'mais', 'as', 'os', 'como', 'mas', 'foi', 'ao', 'ele', 'das', 'tem', 'à', 'seu', 'sua', 'ou', 'ser', 'quando', 'muito', 'há', 'nos', 'já', 'está', 'eu', 'também', 'só', 'pelo', 'pela', 'até', 'isso', 'ela', 'entre', 'era', 'depois', 'sem', 'mesmo', 'aos', 'ter', 'seus', 'suas', 'numa', 'pelos', 'pelas', 'esse', 'esses', 'essa', 'essas', 'num', 'uma', 'uns', 'umas', 'quanto', 'quem', 'qual', 'quais', 'cujo', 'cuja', 'cujos', 'cujas'
]);

// Aguardar carregamento do DOM
document.addEventListener('DOMContentLoaded', function() {
  // Elementos DOM
  const textInput = document.getElementById('textInput');
  const charCount = document.getElementById('charCount');
  const extractBtn = document.getElementById('extractBtn');
  const keywordsList = document.getElementById('keywordsList');
  const resultsSection = document.getElementById('resultsSection');
  const copyBtn = document.getElementById('copyBtn');
  const stats = document.getElementById('stats');
  const totalWords = document.getElementById('totalWords');
  const uniqueWords = document.getElementById('uniqueWords');
  const keywordCount = document.getElementById('keywordCount');
  const minLength = document.getElementById('minLength');
  const maxKeywords = document.getElementById('maxKeywords');

  // Contador de caracteres
  textInput.addEventListener('input', () => {
    const count = textInput.value.length;
    charCount.textContent = count;
    
    if (count > 0) {
      extractBtn.disabled = false;
      extractBtn.classList.remove('disabled');
    } else {
      extractBtn.disabled = true;
      extractBtn.classList.add('disabled');
    }
  });

  // Função para extrair palavras-chave
  function extractKeywords(text, minLen, maxCount) {
    // Limpar e normalizar o texto
    const cleanText = text
      .toLowerCase()
      .replace(/[^\w\sáàâãéèêíìîóòôõúùûç]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return { keywords: [], totalWords: 0, uniqueWords: 0 };

    // Dividir em palavras
    const words = cleanText.split(' ').filter(word => word.length >= minLen);
    const totalWordsCount = words.length;

    // Filtrar stop words e contar frequência
    const wordFreq = {};
    const filteredWords = words.filter(word => !stopWords.has(word));

    filteredWords.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    // Ordenar por frequência e pegar as top palavras
    const sortedWords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, maxCount);

    return {
      keywords: sortedWords,
      totalWords: totalWordsCount,
      uniqueWords: Object.keys(wordFreq).length
    };
  }

  // Função para renderizar palavras-chave
  function renderKeywords(keywords) {
    if (keywords.length === 0) {
      keywordsList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">×</div>
          <p>Nenhuma palavra-chave encontrada com os critérios selecionados</p>
        </div>
      `;
      return;
    }

    const maxFreq = keywords[0][1];
    
    keywordsList.innerHTML = keywords.map(([word, freq], index) => {
      const intensity = Math.max(0.3, freq / maxFreq);
      const rank = index + 1;
      
      return `
        <div class="keyword-item" style="--intensity: ${intensity}">
          <div class="keyword-rank">#${rank}</div>
          <div class="keyword-content">
            <span class="keyword-text">${word}</span>
            <div class="keyword-meta">
              <span class="keyword-freq">${freq}x</span>
              <div class="keyword-bar">
                <div class="keyword-bar-fill" style="width: ${(freq / maxFreq) * 100}%"></div>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Event listener para extração
  extractBtn.addEventListener('click', () => {
    const text = textInput.value.trim();
    if (!text) return;

    const minLen = parseInt(minLength.value);
    const maxCount = parseInt(maxKeywords.value);

    extractBtn.innerHTML = '<span class="btn-icon">...</span>Extraindo...';
    extractBtn.disabled = true;

    // Simular processamento
    setTimeout(() => {
      const result = extractKeywords(text, minLen, maxCount);
      
      renderKeywords(result.keywords);
      
      // Atualizar estatísticas
      totalWords.textContent = result.totalWords;
      uniqueWords.textContent = result.uniqueWords;
      keywordCount.textContent = result.keywords.length;
      
      // Mostrar resultados
      stats.style.display = 'flex';
      copyBtn.style.display = result.keywords.length > 0 ? 'flex' : 'none';
      
      // Restaurar botão
      extractBtn.innerHTML = '<span class="btn-icon">→</span>Extrair Palavras-Chave';
      extractBtn.disabled = false;
      
      // Scroll suave para resultados
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }, 1000);
  });

  // Função para copiar palavras-chave
  copyBtn.addEventListener('click', () => {
    const keywords = Array.from(document.querySelectorAll('.keyword-text'))
      .map(el => el.textContent)
      .join(', ');
    
    navigator.clipboard.writeText(keywords).then(() => {
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '<span class="copy-icon">✓</span>Copiado!';
      copyBtn.classList.add('copied');
      
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.classList.remove('copied');
      }, 2000);
    });
  });

  // Inicializar estado do botão
  extractBtn.disabled = true;
  extractBtn.classList.add('disabled');
});