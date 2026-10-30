async function planlaYerelBildirimler() {
    try {
        const LN = window.Capacitor?.Plugins?.LocalNotifications;
        if (!LN) return;

        await LN.requestPermissions();

        const pending = await LN.getPending();
        if (pending && pending.notifications && pending.notifications.length > 0) {
            await LN.cancel({ notifications: pending.notifications });
        }

        const notifications = [];
        const simdi = new Date();
        let id = 1000;

        if (typeof state !== 'undefined' && state && state.loans) {
            state.loans.forEach((item) => {
                let ay = simdi.getMonth();
                let yil = simdi.getFullYear();

                if (item.paidThisMonth || simdi.getDate() >= item.day) {
                    ay += 1;
                    if (ay > 11) { ay = 0; yil += 1; }
                }

                let gun = item.day - 1;
                if (gun < 1) gun = 1;

                const alarm = new Date(yil, ay, gun, 9, 0, 0);

                if (alarm > simdi) {
                    notifications.push({
                        id: ++id,
                        title: "Ödeme Vakti Yaklaştı ⚠️",
                        body: `${item.bank} - ${Number(item.amount).toLocaleString('tr-TR')} ₺ ödemen yarın!`,
                        schedule: { at: alarm, allowWhileIdle: true }
                    });
                }
            });
        }

        if (notifications.length > 0) {
            await LN.schedule({ notifications });
        }
    } catch (e) {
        console.error("Bildirim hatası:", e);
    }
}
