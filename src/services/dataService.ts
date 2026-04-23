import Papa from 'papaparse';
import { parse, isToday, isYesterday, isValid } from 'date-fns';

export interface Appointment {
  Responsavel: string;
  DataAgendamento: Date;
  Status: string;
  Diretoria: string;
  Equipe: string;
}

export interface Statistics {
  total: number;
  todayCount: number;
  yesterdayCount: number;
  growth: number;
  ranking: { name: string; count: number; directorate: string; team: string }[];
  statusDistribution: { name: string; value: number }[];
  directorateRanking: { name: string; count: number }[];
}

// Using Google Visualization API for faster, near real-time updates
const SPREADSHEET_ID = '1YF2FjTpUs1qcGTKzkqWFpAV1wRAOiP0xQdeuHWhxSZQ';
const GID = '271119995';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&gid=${GID}`;

export async function fetchSheetData(): Promise<Statistics> {
  try {
    // Add cache bypassing by appending a timestamp to the URL
    const cacheBuster = `&t=${new Date().getTime()}`;
    const response = await fetch(SHEET_URL + cacheBuster);
    
    if (!response.ok) {
      throw new Error(`Erro na rede: ${response.status} ${response.statusText}`);
    }

    const csvText = await response.text();
    
    // Check if what we got looks like a Google Sign-in page instead of CSV
    if (csvText.includes('<!doctype html>') || csvText.includes('Google Account') || csvText.includes('login')) {
      throw new Error('A planilha precisa estar com o acesso configurado como "Qualquer pessoa com o link" para funcionar em tempo real.');
    }

    if (csvText.length < 50) {
      throw new Error('A planilha retornou dados insuficientes ou está vazia.');
    }

    return parseCsvData(csvText);
  } catch (error) {
    console.error('Erro ao buscar dados da planilha:', error);
    throw error; // Re-throw to show error in UI
  }
}

function parseCsvData(csvText: string): Promise<Statistics> {
  console.log('Processando CSV de tamanho:', csvText.length);
  
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: 'greedy',
      dynamicTyping: true,
      delimitersToGuess: [',', ';', '\t'],
      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn('Erros detectados pelo PapaParse:', results.errors);
        }

        if (!results.data || results.data.length === 0) {
          console.error('PapaParse não retornou dados. Verifique o delimitador ou o conteúdo.');
          return reject(new Error('Nenhum dado encontrado na planilha. Verifique se há registros abaixo do cabeçalho.'));
        }

        console.log('Primeira linha recebida:', results.data[0]);
        console.log('Colunas detectadas:', Object.keys(results.data[0]));

        // Filtra linhas que estão totalmente vazias
        const filteredRows = results.data.filter((row: any) => 
          Object.values(row).some(val => val !== null && val !== undefined && String(val).trim() !== '')
        );

        console.log(`Linhas com conteúdo: ${filteredRows.length} de ${results.data.length}`);

        const data: Appointment[] = filteredRows.map((row: any, index: number) => {
          // Robust column matching (trimming, case handling, and common Portuguese variants)
          const findValue = (possibleKeys: string[]) => {
            const rowKeys = Object.keys(row);
            const key = rowKeys.find(k => {
              const cleanK = k.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
              return possibleKeys.some(pk => {
                const cleanPK = pk.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                return cleanK === cleanPK || cleanK.includes(cleanPK) || cleanPK.includes(cleanK);
              });
            });
            return key ? row[key] : null;
          };

          const name = findValue(['Nome do corretor', 'Responsavel', 'Corretor', 'Nome completo do corretor', 'Broker']) || 'Desconhecido';
          const dateStr = findValue(['Carimbo', 'Data', 'Data do Agendamento', 'Agendamento', 'Timestamp']) || '';
          const status = findValue(['Status', 'Situacao', 'Confirmacao', 'Etapa']) || 'Sem Status';
          const diretoria = findValue(['Diretoria', 'Regional', 'Lado']) || 'Outros';
          const equipe = findValue(['Equipe', 'Time', 'Grupo', 'Loja']) || 'Sem Equipe';

          if (index === 0) {
            console.log('Mapeamento da primeira linha:', { name, dateStr, status, diretoria, equipe });
          }

          // Try various formats for date
          let date: Date;
          if (dateStr && typeof dateStr === 'string') {
            date = parse(dateStr, 'yyyy/MM/dd HH:mm:ss', new Date());
            if (!isValid(date)) date = parse(dateStr, 'dd/MM/yyyy HH:mm:ss', new Date());
            if (!isValid(date)) date = parse(dateStr, 'dd/MM/yyyy', new Date());
            if (!isValid(date)) date = parse(dateStr, 'yyyy-MM-dd', new Date());
            if (!isValid(date)) date = new Date(dateStr);
          } else if (dateStr instanceof Date) {
            date = dateStr;
          } else {
            date = new Date();
          }

          if (!isValid(date)) {
            date = new Date(); // Fallback to now if totally invalid
          }

          return {
            Responsavel: String(name),
            DataAgendamento: date,
            Status: String(status),
            Diretoria: String(diretoria),
            Equipe: String(equipe)
          };
        });

        console.log(`Processados ${data.length} registros com sucesso.`);

        // Calculations
        const total = data.length;
        const todayCount = data.filter(a => isToday(a.DataAgendamento)).length;
        const yesterdayCount = data.filter(a => isYesterday(a.DataAgendamento)).length;

        const growth = yesterdayCount === 0 
          ? (todayCount > 0 ? 100 : 0) 
          : ((todayCount - yesterdayCount) / yesterdayCount) * 100;

        // Ranking
        const brokerData: Record<string, { count: number; directorate: string; team: string }> = {};
        data.forEach(a => {
          if (!brokerData[a.Responsavel]) {
            brokerData[a.Responsavel] = { count: 0, directorate: a.Diretoria, team: a.Equipe };
          }
          brokerData[a.Responsavel].count += 1;
        });
        const ranking = Object.entries(brokerData)
          .map(([name, info]) => ({ name, count: info.count, directorate: info.directorate, team: info.team }))
          .sort((a, b) => b.count - a.count);

        // Directorate Ranking
        const dirCounts: Record<string, number> = {};
        data.forEach(a => {
          dirCounts[a.Diretoria] = (dirCounts[a.Diretoria] || 0) + 1;
        });
        const directorateRanking = Object.entries(dirCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);

        // Status Distribution
        const statusCounts: Record<string, number> = {};
        data.forEach(a => {
          statusCounts[a.Status] = (statusCounts[a.Status] || 0) + 1;
        });
        const statusDistribution = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

        resolve({
          total,
          todayCount,
          yesterdayCount,
          growth,
          ranking,
          statusDistribution,
          directorateRanking,
        });
      },
      error: (error: any) => {
        reject(error);
      }
    });
  });
}
