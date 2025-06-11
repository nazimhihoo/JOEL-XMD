} catch (error) {
    console.error('Error in videoHandler:', error.message || error);
    await sock.sendMessage(m.from, {
      text: "```An unexpected error occurred! Both primary and fallback failed.```",
    }, { quoted: m });
    if (typeof m.React === 'function') await m.React('❌');
  }
}
