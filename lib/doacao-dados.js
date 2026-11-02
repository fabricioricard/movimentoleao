// Dados da página /doacoes. Edite só este arquivo.
//
// 1) Ponha a imagem do QR Code em public/pix/qrcode-pix.png e troque `qr: null` por `qr: "/pix/qrcode-pix.png"`.
// 2) Preencha `chave` (a chave PIX) e `recebedor` (o nome que aparece no banco quando a pessoa vai pagar).
//    Enquanto `chave` for null, a página não mostra o botão de copiar.
//    Enquanto `qr` for null, a página mostra "QR Code em breve".
export const PIX = {
  qr: "/pix/qrcode-pix.png",
  chave: "00020126650014br.gov.bcb.pix01363199f4ad-0464-41bd-bf98-25cc092fe4c90203Pix5204000053039865802BR5925FABRICIO_RICARD_DA_SILVA_6008SALVADOR62080504Doao6304CACF", // código "Pix copia e cola" do QR Code
  rotuloChave: "Pix copia e cola", // título do campo; troque por "Chave PIX" se colocar uma chave em vez do código
  tipoChave: null,
  recebedor: "Fabricio Ricard da Silva Leite", // nome que o banco mostra a quem paga
};

// Para que serve o dinheiro. Ajuste ao que for verdade.
export const USOS = [
  "Domínio e manutenção do site.",
  "Divulgação e materiais do movimento.",
];
