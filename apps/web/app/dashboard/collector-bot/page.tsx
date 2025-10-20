'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function CollectorBotPage() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [avatar, setAvatar] = useState('1.png');
  const [type, setType] = useState<'text' | 'confirm'>('text');
  const [role, setRole] = useState('System');

  const sendNotification = async () => {
    try {
      const response = await fetch('/api/collector-bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          desc,
          avatar,
          type,
          role,
          unread_message: true
        }),
      });

      if (response.ok) {
        alert('Notifikacija poslata!');
        setTitle('');
        setDesc('');
      } else {
        alert('Greška pri slanju notifikacije');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Greška pri slanju notifikacije');
    }
  };

  const sendSystemNotification = async () => {
    const systemNotifications = [
      {
        title: "System Update",
        desc: "New system update is available",
        type: "text" as const
      },
      {
        title: "Security Alert",
        desc: "New login from unknown device",
        type: "confirm" as const
      },
      {
        title: "Backup Complete",
        desc: "System backup completed successfully",
        type: "text" as const
      },
      {
        title: "Maintenance Required",
        desc: "Scheduled maintenance in 2 hours",
        type: "confirm" as const
      }
    ];

    const random = systemNotifications[Math.floor(Math.random() * systemNotifications.length)];
    
    try {
      const response = await fetch('/api/collector-bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...random,
          role: 'System'
        }),
      });

      if (response.ok) {
        alert('Sistemska notifikacija poslata!');
      } else {
        alert('Greška pri slanju notifikacije');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Greška pri slanju notifikacije');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Collector Bot - Test Panel</CardTitle>
            <CardDescription>
              Testiraj collector bot koji šalje notifikacije sa profile photo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Naslov</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Unesite naslov notifikacije"
                />
              </div>
              <div>
                <Label htmlFor="avatar">Avatar</Label>
                <Select value={avatar} onValueChange={setAvatar}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => (
                      <SelectItem key={i + 1} value={`${i + 1}.png`}>
                        Avatar {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="desc">Opis</Label>
              <Textarea
                id="desc"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Unesite opis notifikacije"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Tip</Label>
                <Select value={type} onValueChange={(value: 'text' | 'confirm') => setType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="confirm">Confirm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="role">Uloga</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="System">System</SelectItem>
                    <SelectItem value="User">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={sendNotification} disabled={!title || !desc}>
                Pošalji Notifikaciju
              </Button>
              <Button onClick={sendSystemNotification} variant="outline">
                Pošalji Sistemsku
              </Button>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Kako radi:</h3>
              <ul className="text-sm space-y-1">
                <li>• Collector bot šalje notifikacije samo kada se eksplicitno pozove</li>
                <li>• Sistemske notifikacije koriste avatar 1.png</li>
                <li>• Korisničke notifikacije koriste različite avatare</li>
                <li>• Dizajn ostaje isti kao originalni</li>
                <li>• Klikni na bell icon u header-u da vidiš notifikacije</li>
                <li>• Klikni na notifikaciju da je označiš kao pročitanu</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
