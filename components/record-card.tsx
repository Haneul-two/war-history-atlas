'use client';
/* eslint-disable next/no-img-element -- Self-hosted archival assets are already resized; preserve their documented dimensions. */
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import Link from '@/components/site-link';
import { getWar } from '@/lib/history';
import { accessLabels, type HistoricalRecord } from '@/lib/records';

export function RecordCard({
  record: r,
  showWar = true,
}: {
  record: HistoricalRecord;
  showWar?: boolean;
}) {
  const image = r.image;
  return (
    <article
      className={'record-card ' + (image ? 'image-record' : '')}
      data-record-id={r.id}
    >
      {image && (
        <Dialog>
          <DialogTrigger
            className="record-image-trigger"
            aria-label={r.title + ' 크게 보기'}
          >
            <img
              src={image.src}
              alt={r.title}
              width={image.width}
              height={image.height}
              loading="lazy"
            />
            <span>이미지 크게 보기</span>
          </DialogTrigger>
          <DialogContent className="record-dialog" showCloseButton={false}>
            <div className="record-dialog-heading">
              <DialogTitle>{r.title}</DialogTitle>
              <DialogClose className="btn">닫기</DialogClose>
            </div>
            <DialogDescription>
              {r.date} · {r.medium}
            </DialogDescription>
            <img
              className="record-full-image"
              src={image.src}
              alt={r.title}
              width={image.width}
              height={image.height}
              style={{ maxWidth: image.width }}
            />
            <p>{r.summary}</p>
            <p className="record-caution">{r.caution}</p>
            <p className="record-credit">
              {r.creator}
              <br />
              {r.holder}
              <br />
              {image.rights}
            </p>
            <a
              className="record-source"
              href={r.url}
              target="_blank"
              rel="noreferrer"
            >
              소장처 원본과 권리 안내 ↗
            </a>
          </DialogContent>
        </Dialog>
      )}
      <div className="record-body">
        <p className="record-meta">
          {image ? r.medium : accessLabels[r.access]} · {r.date}
        </p>
        <h3>{r.title}</h3>
        {showWar && (
          <Link className="record-war" href={'/wars/' + r.warId}>
            {getWar(r.warId)?.title} 읽기 →
          </Link>
        )}
        <p>{r.summary}</p>
        <div className="record-question">
          <span>읽으며 생각해 볼 질문</span>
          <p>{r.question}</p>
        </div>
        <p className="record-caution">{r.caution}</p>
        <dl className="record-details">
          <div>
            <dt>작성·제작</dt>
            <dd>{r.creator}</dd>
          </div>
          <div>
            <dt>소장·제공</dt>
            <dd>{r.holder}</dd>
          </div>
          {!image && (
            <div>
              <dt>열람 형태</dt>
              <dd>{r.language}</dd>
            </div>
          )}
          {image && (
            <div>
              <dt>사용 권리</dt>
              <dd>{image.rights}</dd>
            </div>
          )}
        </dl>
        <a
          className="record-source"
          href={r.url}
          target="_blank"
          rel="noreferrer"
        >
          {r.access === 'catalogue'
            ? '소장 목록 보기'
            : image
              ? '소장처 원본 보기'
              : '문서 읽기'}{' '}
          ↗
        </a>
      </div>
    </article>
  );
}
