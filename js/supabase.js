//
// SUPABASE HANDLING
//
// Como aprendido em algoritmos e Linguagem de Programação I, vamos seguir
// os pilares da POO!
// O código antes apresentado provavelmente foi uma das coisas mais horrendas já escritas
// estava dificultando coisas fáceis, adicionando uma redundância absurdamente desnecessária,
// além de que cada vez q vc precisava de algo do banco de dados vc executava 2000 linhas de
// código que podiam ser escritas 1 única vez e o metodo chamado
// -------------------------------
// Quero adicionar aqui que ao iniciar o meu refatoramento total do código
// existiam 1850 linhas, assinado carinhosamente fassina 💕💕


const SUPABASE_URL = 'https://kkkotkknftwukirkabol.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtra290a2tuZnR3dWtpcmthYm9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Nzk2MDIsImV4cCI6MjA2ODM1NTYwMn0.RvJEK16tej2O8uMbhmWwxEUSRDA0fSIZyxIVi5cs82U';

import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.56.1/+esm';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

export class SupabaseService {
    constructor() {
        this.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    }


    selectArea() {
        supabase.from('area').select('*');
    }


//pega as universidades e ja faz o query trim, configurando tudinho, fazer o getter normal só se precisar :)
    getUniversidadesQuery(termo) {
        let query = this.supabase
            .from('universidade')
            .select(`
                *,
                municipio:municipio_codigo (nome),
                organizacao:organizacao_academica_codigo (descricao)
            `);

        if (termo) {
            query = query.or(`nome.ilike.%${termo}%,sigla.ilike.%${termo}%`);
        }

        return query; // retorna o query builder
    }

    async getArea() {
        return supabase
            .from("area")
            .select("*");
    }

    async getCursos() {
        return supabase
            .from("curso")
            .select(`*,
            subarea:subarea_codigo(nome),
            grau:grau_codigo(nome)
        `);
    }

    async getSubarea(){
        return supabase
        .from("Subarea")
        .select('codigo, nome');
    }

    async getCampus() {
        return supabase
            .from("campus")
            .select("*");
    }

}


