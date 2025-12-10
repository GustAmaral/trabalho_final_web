export interface Usuario {
    id?: number;
    nome: string;
    email: string;
    senha?: string; // Opcional pois nem sempre retornaremos a senha
    cargo?: 'admin' | 'cozinheiro';
}