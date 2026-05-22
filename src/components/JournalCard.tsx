import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Edit3 } from 'lucide-react';

export interface Note {
    id: number;
    date: string;
    text: string;
}

interface JournalCardProps {
    notes: Note[];
    onAddNote: (text: string) => void;
    accentColor?: string;
    placeholder?: string;
    saveBtnStyle?: CSSProperties;
}

export default function JournalCard({
    notes,
    onAddNote,
    accentColor = '#a855f7',
    placeholder = 'How did your session go?',
    saveBtnStyle,
}: JournalCardProps) {
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [newNoteText, setNewNoteText] = useState('');
    const [showAllNotes, setShowAllNotes] = useState(false);

    const handleSave = () => {
        if (!newNoteText.trim()) {
            setIsAddingNote(false);
            return;
        }
        onAddNote(newNoteText.trim());
        setNewNoteText('');
        setIsAddingNote(false);
    };

    return (
        <div className="hd-card hd-card-journal">
            <div className="hd-journal-header">
                <h3>Journal</h3>
                <button
                    style={{
                        background: 'none',
                        border: 'none',
                        color: isAddingNote ? accentColor : '#a1a1aa',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                    onClick={() => setIsAddingNote(!isAddingNote)}
                >
                    <Edit3 size={16} className="hd-journal-icon" />
                </button>
            </div>

            <div className="hd-journal-list">
                {isAddingNote && (
                    <div className="hd-journal-entry hd-add-note">
                        <textarea
                            autoFocus
                            placeholder={placeholder}
                            value={newNoteText}
                            onChange={(e) => setNewNoteText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSave();
                                }
                            }}
                        />
                        <div className="hd-add-note-actions">
                            <button className="hd-cancel-btn" onClick={() => setIsAddingNote(false)}>Cancel</button>
                            <button className="hd-save-btn" style={saveBtnStyle} onClick={handleSave}>Save</button>
                        </div>
                    </div>
                )}

                {notes.slice(0, showAllNotes ? notes.length : 3).map(note => (
                    <div key={note.id} className="hd-journal-entry">
                        <span className="hd-journal-date">{note.date}</span>
                        <p>{note.text}</p>
                    </div>
                ))}
            </div>

            <button className="hd-journal-btn" onClick={() => setShowAllNotes(!showAllNotes)}>
                {showAllNotes ? 'Collapse Notes' : 'View All Notes'}
            </button>
        </div>
    );
}
