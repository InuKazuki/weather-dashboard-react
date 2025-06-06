import React, { useState, useEffect } from "react";

const WeatherDashboard = () => {

const [weatherData, setWeatherData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'chave_de_desenvolvimento'

useEffect(() => {
    buscarTempo();
}, []);

const buscarTempo = async () => {
    try {
        setLoading(true);
        setError(null);

        const resposta = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=Florianópolis&days=3&lang=pt`);
        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const dados = await resposta.json();
        
        if (dados.error) {
            throw new Error(dados.error.message);
        }

        setWeatherData(dados);
    } catch (erro) {
        console.error('Erro', erro);
        setError('Erro ao carregar dados do tempo');
        setWeatherData(null);
    } finally {
        setLoading(false);
    }
};

const formatarDiaSemana = (dateString) => {
    const data = new Date(dateString);
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    if (data.toDateString() === hoje.toDateString()) {
        return 'Hoje';
    }
    
    if (data.toDateString() === amanha.toDateString()) {
        return 'Amanhã';
    }

    return data.toLocaleDateString('pt-BR', { weekday: 'short' });
};

if (loading) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center">
            <div className="text-center">
                {/* Spinner CSS animado */}
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
                <div className="text-white text-xl font-medium">Carregando...</div>
            </div>
        </div>
    );
}

if (error) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-400 via-red-500 to-red-600 flex items-center justify-center">
            <div className="text-center">
                <div className="text-white text-xl mb-4">{error}</div>
                {/* Botão que chama a função buscarTempo */}
                <button
                    onClick={buscarTempo}
                    className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-2 rounded-full hover:bg-white/30 transition-all duration-300"    
                    >
                        Tentar Novamente
                    </button>
            </div>
        </div>
    );
}
return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4">
      <div className="max-w-4xl mx-auto">
        
        {/* ===== CABEÇALHO ===== */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
            Previsão do Tempo
          </h1>
          <p className="text-white/80 text-lg">
            {/* Operador ?. (optional chaining) evita erro se weatherData for null */}
            Acompanhe o clima em {weatherData?.location?.name}
          </p>
        </header>
        
        <main>
          {/* ===== CLIMA ATUAL ===== */}
          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 mb-8 border border-white/30 shadow-2xl">
            <h2 className="text-3xl font-semibold text-white mb-6 text-center">
              {weatherData?.location?.name}
            </h2>
            
            {/* Container flex para temperatura e ícone lado a lado */}
            <div className="flex items-center justify-center mb-6">
              <span className="text-6xl font-light text-white mr-4">
                {/* Math.round() arredonda para número inteiro */}
                {Math.round(weatherData?.current?.temp_c)}°C
              </span>
              <img 
                src={`https:${weatherData?.current?.condition?.icon}`}
                alt={weatherData?.current?.condition?.text}
                className="w-20 h-20"
              />
            </div>
            
            <p className="text-xl text-white/90 text-center mb-8 capitalize">
              {weatherData?.current?.condition?.text}
            </p>
            
            {/* ===== GRID DE DETALHES ===== */}
            {/* Grid responsivo que se adapta automaticamente */}
            <div className="grid grid-cols-2 gap-6">
              {/* Cada card de detalhe */}
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <span className="text-white/80 text-sm block mb-1">Umidade</span>
                <span className="text-white text-xl font-semibold">
                  {weatherData?.current?.humidity}%
                </span>
              </div>
              
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <span className="text-white/80 text-sm block mb-1">Sensação térmica</span>
                <span className="text-white text-xl font-semibold">
                  {Math.round(weatherData?.current?.feelslike_c)}°C
                </span>
              </div>
              
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <span className="text-white/80 text-sm block mb-1">Vento</span>
                <span className="text-white text-xl font-semibold">
                  {weatherData?.current?.wind_kph} km/h
                </span>
              </div>
              
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <span className="text-white/80 text-sm block mb-1">Visibilidade</span>
                <span className="text-white text-xl font-semibold">
                  {weatherData?.current?.vis_km} km
                </span>
              </div>
            </div>
          </div>

          {/* ===== PREVISÃO DOS PRÓXIMOS DIAS ===== */}
          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-2xl">
            <h3 className="text-2xl font-semibold text-white mb-6 text-center">
              Próximos Dias
            </h3>
            
            {/* Grid responsivo para os cards de previsão */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* ===== MAP PARA RENDERIZAR LISTA ===== */}
              {/* .map() percorre cada item do array e retorna um JSX para cada um */}
              {weatherData?.forecast?.forecastday?.map((dia, index) => (
                <div 
                  key={index} // Key é obrigatória em listas React para performance
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  {/* Nome do dia */}
                  <div className="text-white/90 font-medium mb-3 capitalize">
                    {formatarDiaSemana(dia.date)}
                  </div>
                  
                  {/* Ícone do clima */}
                  <img 
                    src={`https:${dia.day.condition.icon}`}
                    alt={dia.day.condition.text}
                    className="w-12 h-12 mx-auto mb-3"
                  />
                  
                  {/* Temperatura máxima */}
                  <div className="text-white text-lg font-semibold mb-1">
                    {Math.round(dia.day.maxtemp_c)}°
                  </div>
                  
                  {/* Temperatura mínima */}
                  <div className="text-white/70 text-sm mb-2">
                    {Math.round(dia.day.mintemp_c)}°
                  </div>
                  
                  {/* Condição do clima */}
                  <div className="text-white/60 text-xs capitalize">
                    {dia.day.condition.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        
        {/* ===== RODAPÉ COM BOTÃO DE ATUALIZAR ===== */}
        <footer className="text-center mt-8">
          <button 
            onClick={buscarTempo} // Chama a função ao clicar
            className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-3 rounded-full hover:bg-white/30 transition-all duration-300 mx-auto block font-medium"
          >
            🔄 Atualizar Dados
          </button>
          
          <p className="text-white/60 text-sm mt-4">
            Desenvolvido com React e Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  );
};

export default WeatherDashboard;