# Guild Tag Bot

Discord sunucu etiketi (guild tag) takip sistemi ile çalışan bir Discord botu.

## Özellikler

- **Guild Tag Takibi**: Kullanıcılar sunucu etiketini profillerine eklediğinde otomatik rol verir
- **Hoşgeldin Mesajları**: Etiket alan kullanıcılar için özel hoşgeldin mesajları
- **Veda Mesajları**: Etiketi kaldıran kullanıcılar için veda mesajları
- **Modern Embed Sistemi**: Güzel ve kullanıcı dostu mesaj tasarımları
- **Slash Komutlar**: Modern Discord slash komut sistemi

## Kurulum

1. Projeyi klonlayın:
```bash
git clone <repository-url>
cd vsc-guild-tag
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `config.js` dosyasını düzenleyin:
```javascript
module.exports = {
  token: 'YOUR_BOT_TOKEN',
  guild: {
    id: 'YOUR_GUILD_ID',
    channel: 'WELCOME_CHANNEL_ID',
    role: 'MEMBER_ROLE_ID'
  }
};
```

4. Botu başlatın:
```bash
node index.js
```

## Komutlar

- `/ping` - Bot gecikme süresini gösterir

## Yapılandırma

Bot, `config.js` dosyasından aşağıdaki bilgileri alır:

- **token**: Discord bot token'ı
- **guild.id**: Hedef sunucu ID'si
- **guild.channel**: Hoşgeldin/veda mesajlarının gönderileceği kanal ID'si
- **guild.role**: Etiket alan kullanıcılara verilecek rol ID'si

## Nasıl Çalışır

1. Kullanıcı sunucu etiketini profil adına eklediğinde:
   - Bot otomatik olarak tespit eder
   - Kullanıcıya belirtilen rolü verir
   - Hoşgeldin mesajı gönderir

2. Kullanıcı sunucu etiketini kaldırdığında:
   - Bot otomatik olarak tespit eder
   - Kullanıcıdan rolü alır
   - Veda mesajı gönderir

## Gereksinimler

- Node.js 18 veya üzeri
- Discord.js 14.0.0 veya üzeri
- Croxydb (veritabanı)

## Lisans

Bu proje oxyinc tarafından geliştirilmiştir.

---

**discord.gg/vsc ❤️ oxyinc**
